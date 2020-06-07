export const getParamsFromUrl = (p) => {
    let search = window.location.search;
    let params = new URLSearchParams(search);
    let foo = params.get(p);
    return foo;
}