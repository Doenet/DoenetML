import React, { Suspense, useState, useEffect } from 'react';
import {
  atomFamily,
  selectorFamily,
  useRecoilCallback,
  useRecoilValue,
  useRecoilValueLoadable,
  useSetRecoilState,
} from 'recoil';
import { faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { nanoid } from 'nanoid';
import { folderDictionaryFilterSelector } from '../../../_reactComponents/Drive/NewDrive';
import Button from '../../../_reactComponents/PanelHeaderComponents/Button';
import ButtonGroup from '../../../_reactComponents/PanelHeaderComponents/ButtonGroup';
import { searchParamAtomFamily } from '../NewToolRoot';
import {
  fileByContentId,
  itemHistoryAtom,
} from '../ToolHandlers/CourseToolHandler';
import axios from 'axios';
import { returnAllPossibleVariants } from '../../../Core/utils/returnAllPossibleVariants';
import { itemType } from '../../../_reactComponents/Sockets';
import {
  serializedComponentsReplacer,
  serializedComponentsReviver,
} from '../../../Core/utils/serializedStateProcessing';

export default function CollectionEditor() {
  const [driveId, , itemId] = useRecoilValue(
    searchParamAtomFamily('path'),
  ).split(':');
  const doenetId = useRecoilValue(searchParamAtomFamily('doenetId'));
  const [availableEntries, setAvailableEntries] = useState([]);
  const [assignedEntries, setAssignedEntries] = useState([]);

  const initEntryByDoenetId = useRecoilCallback(
    ({ snapshot, set }) =>
      async (doenetId) => {
        const release = snapshot.retain();
        try {
          const versionHistory = await snapshot.getPromise(
            itemHistoryAtom(doenetId),
          );
          let contentId = null;
          for (const version in versionHistory?.named) {
            if (versionHistory?.named[version]?.isReleased === '1') {
              contentId = versionHistory.named[version].contentId;
              break;
            }
          }
          let response = await snapshot.getPromise(fileByContentId(contentId));
          if (typeof response === 'object') {
            response = response.data;
          }
          returnAllPossibleVariants({
            doenetML: response,
            callback: ({ allPossibleVariants }) => {
              set(possibleVariantsByDoenetId(doenetId), allPossibleVariants);
            },
          });
        } finally {
          release();
        }
      },
    [],
  );

  const assignedEntriesData = useRecoilValueLoadable(
    assignedEntiresInfo(doenetId),
  ).getValue();

  useEffect(() => {
    const entries = [];
    for (let key in assignedEntriesData) {
      const { doenetId, entryId, entryDoenetId, entryVariant } =
        assignedEntriesData[key];
      console.log('v', entryVariant);
      entries.push(
        <Suspense key={entryId}>
          <CollectionEntry
            collectionDoenetId={doenetId}
            doenetId={entryDoenetId}
            entryId={entryId}
            variant={JSON.parse(entryVariant, serializedComponentsReviver).name}
            assigned
          />
        </Suspense>,
      );
    }
    setAssignedEntries(entries);
  }, [assignedEntriesData]);

  const folderInfoObj = useRecoilValueLoadable(
    folderDictionaryFilterSelector({
      driveId,
      folderId: itemId,
    }),
  ).getValue();

  useEffect(() => {
    const entries = [];
    for (let key in folderInfoObj.contentsDictionary) {
      if (
        folderInfoObj.contentsDictionary[key].itemType === itemType.DOENETML
      ) {
        const { doenetId, isReleased } = folderInfoObj.contentsDictionary[key];
        if (isReleased) {
          initEntryByDoenetId(doenetId);
          entries.push(
            <Suspense key={key}>
              <CollectionEntry
                collectionDoenetId={folderInfoObj.folderInfo.doenetId}
                doenetId={doenetId}
              />
            </Suspense>,
          );
        }
      }
    }
    setAvailableEntries(entries);
    return () => {
      setAvailableEntries([]);
    };
  }, [folderInfoObj, initEntryByDoenetId]);
  if (availableEntries.length === 0) {
    return (
      <div
        style={{
          padding: '8px',
        }}
      >
        <p>
          No Relesed DoenetML files were found in this Colletion. Please add
          files from the Content screen to continue.
        </p>
      </div>
    );
  }
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        rowGap: '4px',
        maxWidth: '850px',
        margin: '10px 20px',
      }}
    >
      {assignedEntries}
      <div style={{ height: '10px', background: 'black' }}></div>
      {availableEntries}
    </div>
  );
}

const possibleVariantsByDoenetId = atomFamily({
  key: 'possibleVariantsByDoenetId',
  default: [],
});

const entryInfoByDoenetId = atomFamily({
  key: 'itemInfoByDoenetId',
  default: selectorFamily({
    key: 'itemInfoByDoenetId/Default',
    get:
      (doenetId) =>
      async ({ get }) => {
        try {
          const resp = await axios.get('/api/findDriveIdFolderId.php', {
            params: { doenetId },
          });
          const folderInfo = await get(
            folderDictionaryFilterSelector({
              driveId: resp.data.driveId,
              folderId: resp.data.parentFolderId,
            }),
          );
          return folderInfo.contentsDictionaryByDoenetId[doenetId] ?? {};
        } catch (error) {
          console.error(error);
          return {};
        }
      },
  }),
});

const assignedEntiresInfo = atomFamily({
  key: 'assignedEntiresInfo',
  default: selectorFamily({
    key: 'assignedEntiresInfo/Default',
    get: (doenetId) => async () => {
      try {
        const resp = await axios.get('/api/loadCollection.php', {
          params: { doenetId },
        });
        return resp.data.entries ?? [];
      } catch (error) {
        console.error(error);
        return [];
      }
    },
  }),
});

function CollectionEntry({
  collectionDoenetId,
  doenetId,
  entryId,
  assigned,
  variant,
}) {
  //TODO: should be a socket interaction
  const setAssignedEntries = useSetRecoilState(
    assignedEntiresInfo(collectionDoenetId),
  );
  const entryInfo = useRecoilValueLoadable(
    entryInfoByDoenetId(doenetId),
  ).getValue();

  const variants = useRecoilValueLoadable(
    possibleVariantsByDoenetId(doenetId),
  ).getValue();
  const [selectOptions, setSelectOptions] = useState([]);

  useEffect(() => {
    const options = [];
    for (let key in variants) {
      options.push(
        <option key={variants[key]} value={variants[key]}>
          {variants[key]}
        </option>,
      );
    }
    setSelectOptions(options);
  }, [variants]);

  return (
    <>
      <CollectionEntryDisplayLine
        label={entryInfo.label}
        assigned={assigned}
        selectOptions={selectOptions}
        selectedVariant={variant}
        addEntryToAssignment={() => {
          //TODO: failure toast??
          const entryId = nanoid();
          axios
            .post('/api/addCollectionEntry.php', {
              doenetId: collectionDoenetId,
              entryId,
              entryDoenetId: doenetId,
              //TODO: ref the selected option;
              entryVariant: JSON.stringify(
                variants[0],
                serializedComponentsReplacer,
              ),
            })
            .then(() => {
              setAssignedEntries((was) => [
                ...was,
                {
                  doenetId: collectionDoenetId,
                  entryId,
                  entryDoenetId: doenetId,
                  entryVariant: JSON.stringify(
                    variants[0],
                    serializedComponentsReplacer,
                  ),
                },
              ]);
            })
            .catch((error) => {
              console.error(error);
            });
        }}
        removeEntryFromAssignment={() => {
          axios
            .post('/api/removeCollectionEntry.php', { entryId })
            .then(() => {
              //TODO: failure toast??
              setAssignedEntries((was) =>
                was.filter((entry) => entry.entryId !== entryId),
              );
            })
            .catch((error) => {
              console.error(error);
            });
        }}
        onVariantSelect={(newSelectedVariant) => {
          axios
            .post('/api/updateCollectionEntryVariant.php', {
              entryId,
              entryVariant: JSON.stringify(
                { name: newSelectedVariant },
                serializedComponentsReplacer,
              ),
            })
            .then(() => {
              setAssignedEntries((was) =>
                was.map((entry) => {
                  if (entry.entryId === entryId) {
                    return {
                      ...entry,
                      entryVariant: JSON.stringify(
                        { name: newSelectedVariant },
                        serializedComponentsReplacer,
                      ),
                    };
                  } else {
                    return entry;
                  }
                }),
              );
            })
            .catch((error) => console.error(error));
        }}
      />
    </>
  );
}

//key off of doenet Id a variant display element (active variants?)
function CollectionEntryDisplayLine({
  label,
  addEntryToAssignment,
  removeEntryFromAssignment,
  assigned,
  selectedVariant,
  selectOptions,
  onVariantSelect,
}) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        background: '#e3e3e3',
        borderRadius: '4px',
        padding: '4px',
      }}
    >
      <span style={{ flexGrow: 1 }}>{label}</span>
      <ButtonGroup>
        {assigned ? (
          <>
            <select
              value={selectedVariant}
              onChange={(e) => {
                e.stopPropagation();
                onVariantSelect?.(e.target.value);
              }}
              onBlur={(e) => {
                if (e.target.value !== selectedVariant) {
                  onVariantSelect?.(e.target.value);
                }
              }}
            >
              {selectOptions}
            </select>
            <Button
              value={<FontAwesomeIcon icon={faMinus} />}
              onClick={(e) => {
                e.stopPropagation();
                removeEntryFromAssignment?.();
              }}
            />
          </>
        ) : (
          <Button
            value={<FontAwesomeIcon icon={faPlus} />}
            onClick={(e) => {
              e.stopPropagation();
              addEntryToAssignment?.();
            }}
          />
        )}
      </ButtonGroup>
    </div>
  );
}
