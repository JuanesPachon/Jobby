export function getFirstName(firstName: string | undefined | null): string {
  if (!firstName) return '';
  return firstName.trim().split(' ')[0];
}

export function getFirstLastName(lastName: string | undefined | null): string {
  if (!lastName) return '';
  return lastName.trim().split(' ')[0];
}

export function getShortName(firstName: string | undefined | null, lastName: string | undefined | null): string {
  const first = getFirstName(firstName);
  const last = getFirstLastName(lastName);
  return `${first} ${last}`.trim() || 'Usuario';
}

export function getFullName(firstName: string | undefined | null, lastName: string | undefined | null): string {
  const first = firstName?.trim() || '';
  const last = lastName?.trim() || '';
  return `${first} ${last}`.trim() || 'Usuario';
}