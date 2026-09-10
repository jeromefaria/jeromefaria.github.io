export const createNameLookup = <Entity extends { name: string }>(
  registry: Record<string, Entity>,
): ((name: string) => Entity | undefined) => {
  const byName = new Map<string, Entity>();

  for (const entity of Object.values(registry)) byName.set(entity.name, entity);

  return name => byName.get(name);
};
