export const copyToClipboard = (idName) => {
  /* Get the text field */
  var copyText = document.getElementById(idName);

  /* Select the text field */
  copyText.select();
  copyText.setSelectionRange(0, 99999); /*For mobile devices*/

  /* Copy the text inside the text field */
  document.execCommand("copy");
  /* Alert the copied text */
  return copyText.value;
}

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

export const hendleUndefiendJSON = (obj ={}) => {
  for(let key in obj){
    if(obj[key] === undefined) obj[key] = false;
  }
  return obj;
}

export const formatDate = (date) => {
  date = new Date(date)
  if(isNaN(date.getDate())) return '';
  const minuts = date.getMinutes() < 10? `0${date.getMinutes()}`: date.getMinutes();
  return date.getDate() + '/' + (date.getMonth()+1) + '/' + date.getFullYear() + '  ' + date.getHours() + ':' + minuts;
}


export function generateUniqKey(length){
  var result           = '';
  var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for ( var i = 0; i < length; i++ ) {
     result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}
