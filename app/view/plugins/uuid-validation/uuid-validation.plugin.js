const UUIDPattern = '^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$';


export default function (context, inject) {

  function isUUIDValid(uuid) {
    return (new RegExp(UUIDPattern).test(uuid));
  }

  inject('isUUIDValid', isUUIDValid);
  context.$isUUIDValid = isUUIDValid;
}