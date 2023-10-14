export function findOne(regex, str) {
  const found = regex.exec(str);
  return found && found[0];
}
