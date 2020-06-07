export const getItemFromStorage = (obj) => {
    const res = localStorage.getItem(obj)
    return JSON.parse(res);
}

export const setItemToStorage = (obj,value) => {
    localStorage.setItem(obj,JSON.stringify(value))
}

export const removeItemFromStorage = (obj) => {
    localStorage.removeItem(obj)
}