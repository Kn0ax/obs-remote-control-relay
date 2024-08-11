function appendRow(body, group, name, value) {
    let row = body.insertRow(-1);
    appendToRow(row, `${group} / ${name}`);
    appendToRow(row, value);
}

function updateStatsGeneral(body, stats) {
    appendRow(body, "General", "Started", timeAgoString(new Date(stats.general.startTime * 1000)));
    appendRow(body, "General", "Rate limit exceeded", stats.general.rateLimitExceeded);
}

function updateStatsBridges(body, stats) {
    appendRow(body, "Bridges", "Connected", stats.bridges.connected);
    appendRow(body, "Bridges", "Remote controllers connected", stats.bridges.remoteControllersConnected);
}

function updateStatsRemoteControllers(body, stats) {
    appendRow(body, "Remote controllers", "Connected", stats.remoteControllers.connected);
}

function updateStatsTrafficBridgesToRemoteControllers(body, stats) {
    appendRow(body, "Traffic / Bridges to remote controllers", "Total bytes", bytesToString(stats.traffic.bridgesToRemoteControllers.totalBytes));
    appendRow(body, "Traffic / Bridges to remote controllers", "Current bitrate", bitrateToString(stats.traffic.bridgesToRemoteControllers.currentBitrate));
}

function updateStatsTrafficRemoteControllersToBridges(body, stats) {
    appendRow(body, "Traffic / Remote controllers to bridges", "Total bytes", bytesToString(stats.traffic.remoteControllersToBridges.totalBytes));
    appendRow(body, "Traffic / Remote controllers to bridges", "Current bitrate", bitrateToString(stats.traffic.remoteControllersToBridges.currentBitrate));
}

async function updateStats() {
    let response = await fetch("stats.json")
    if (!response.ok) {
        return;
    }
    const stats = await response.json()
    let body = getTableBody('statistics');
    updateStatsGeneral(body, stats);
    updateStatsBridges(body, stats);
    updateStatsRemoteControllers(body, stats);
    updateStatsTrafficBridgesToRemoteControllers(body, stats);
    updateStatsTrafficRemoteControllersToBridges(body, stats);
}

window.addEventListener('DOMContentLoaded', async (event) => {
    updateStats();
    setInterval(() => {
        updateStats();
    }, 2000);
});
