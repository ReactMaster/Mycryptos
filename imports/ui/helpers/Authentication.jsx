/* 2017-8-8
 * created by Liam M.
 * */
export function isLoggedIn() {
    let isAuthorized = Meteor.userId() ? true : false;

    return isAuthorized;
}

export function isLoggedOut() {
    Meteor.logout(function() {
        window.location.reload();
    });
}

export function detectMobile() {
    if( navigator.userAgent.match(/Android/i)
        || navigator.userAgent.match(/webOS/i)
        || navigator.userAgent.match(/iPhone/i)
        || navigator.userAgent.match(/iPod/i)
        || navigator.userAgent.match(/BlackBerry/i)
        || navigator.userAgent.match(/Windows Phone/i)
    ){
        return true;
    }
    else {
        return false;
    }
}