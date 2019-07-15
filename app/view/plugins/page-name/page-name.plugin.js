export default function (context, inject) {
  function getPageName(name) {
    return { title: `LBX Pay | ${name}` };
  }

  inject('getPageName', getPageName);
  context.$getPageName = getPageName;
}