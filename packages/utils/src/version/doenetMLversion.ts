export const currentVersion = "0.6";

const phaseOutPlan: Record<number, string> = { 0.6: "summer 2025" };

export function returnCurrentMinorVersionNumber(): number {
    let versionPieces = currentVersion.match(/^(\d+)\.(\d+)/);

    return (
        Math.round(Number(versionPieces![1]) * 10 + Number(versionPieces![2])) /
        10
    );
}

export function returnDeprecationMessage(removeInVersion: number): string {
    let versionPhrase = `version ${removeInVersion}`;
    let currentMinorVersion = returnCurrentMinorVersionNumber();

    // Note: until we hit 1.0, we'll call minor versions major versions
    if (removeInVersion === currentMinorVersion + 0.1) {
        versionPhrase = `the next major version (${removeInVersion})`;
    }

    let phaseOutPhrase = "";
    let phaseOut = phaseOutPlan[currentMinorVersion];
    if (phaseOut) {
        phaseOutPhrase = ` Version ${currentMinorVersion} will be phased out in ${phaseOut}.`;
    }

    return `Its use will become an error in ${versionPhrase}.${phaseOutPhrase}`;
}
