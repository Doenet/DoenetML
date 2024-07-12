import React from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import { saveAs } from "file-saver";
import JSZip from "jszip";

/**
 * A popup window that allows the user to inspect or download files in `fileList`.
 * @param param0
 */
export function DownloadInspector({
    fileList,
    show,
    setShow,
}: {
    fileList: Record<string, string>;
    show: boolean;
    setShow: (show: boolean) => void;
}) {
    const handleClose = () => setShow(false);
    function download() {
        if (Object.keys(fileList).length === 0) {
            // Nothing to save
            return;
        }
        if (Object.keys(fileList).length === 1) {
            const [filename, content] = Object.entries(fileList)[0];
            // Download the file directly without zipping it.
            const blob = new Blob([content], {
                type: "text/plain;charset=utf-8",
            });
            saveAs(blob, filename);
            return;
        }
        const archive = new JSZip();
        for (const [filename, content] of Object.entries(fileList)) {
            archive.file(filename, content);
        }
        archive.generateAsync({ type: "blob" }).then((blob) => {
            saveAs(blob, "exported.zip");
        });
    }

    return (
        <Modal
            show={show}
            onHide={handleClose}
            size="xl"
            dialogClassName="modal-full"
        >
            <Modal.Header closeButton>
                <Modal.Title>Exported</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Tabs>
                    {Object.entries(fileList).map(([filename, content]) => (
                        <Tab
                            eventKey={filename}
                            title={filename}
                            key={filename}
                        >
                            <div className="file-preview">
                                <pre>{content}</pre>
                            </div>
                        </Tab>
                    ))}
                </Tabs>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose} size="sm">
                    Close
                </Button>
                <Button
                    variant="primary"
                    onClick={() => {
                        download();
                        handleClose();
                    }}
                    size="sm"
                    disabled={Object.keys(fileList).length === 0}
                >
                    Download{Object.keys(fileList).length > 1 ? " All" : ""}
                </Button>
            </Modal.Footer>
        </Modal>
    );
}
