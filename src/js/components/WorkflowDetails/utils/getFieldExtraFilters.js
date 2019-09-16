export function getFieldExtraFilters(field, extraFilters) {
  const fieldTag = field.definition.tag;
  const extraFiltersList =
    extraFilters && extraFilters.filters ? extraFilters.filters : null;
  let foundFilter = null;

  if (extraFiltersList) {
    foundFilter = extraFiltersList.find(filter => {
      return filter.field === fieldTag;
    });
  }

  return foundFilter;
}
