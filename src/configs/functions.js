export const convertToArr = (list = {}) => {
    let tempArr = [];
    for(let key in list){
      const elem = {
        ...list[key], id: key
      }
      tempArr.push(elem)
    }
    return tempArr;
  }


 export function shareFacebook() {
    var text = window.location.href;
    var url = 'https://www.facebook.com/sharer/sharer.php?u='+text;
    var win = window.open(url, '_blank');
    win.focus();
  }