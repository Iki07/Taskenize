//provera da li korisnik ima odredjenu kobinaciju rola-workspace
export function useAuthCheck() {
    function canPerformAction(currentWspId, requiredRoleId, userAuthData) {
        return userAuthData.some(combo => combo.wsp_id === currentWspId && combo.rol_id === requiredRoleId);
    }

    function hasRoleInWorkspaces(workspaceIds, requiredRoleId, userAuthData) {
        if (workspaceIds === 'all') {
            // Ako je odabran "all", proveravam sve workspace-ove iz userAuthData iz sesije
            return userAuthData.some(combo => combo.rol_id === requiredRoleId);
        } else {
            // U suprotnom, proveravam samo selektovane workspace-ove
            return workspaceIds.some(workspaceId => canPerformAction(workspaceId, requiredRoleId, userAuthData));
        }
    }

    function isAdmin(workspaceIds, userAuthData) {
        return hasRoleInWorkspaces(workspaceIds, 2, userAuthData);
    }

    function isPM(workspaceIds, userAuthData) {
        return hasRoleInWorkspaces(workspaceIds, 4, userAuthData);
    }

    function isTM(workspaceIds, userAuthData) {
        return hasRoleInWorkspaces(workspaceIds, 5, userAuthData);
    }

    return {
        canPerformAction, hasRoleInWorkspaces, isAdmin, isPM, isTM
    }
}
