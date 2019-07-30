function requiredParam(param) {
  throw new Error(`Required param ${param} is missing`);
}

/**
 * Returns a proxy for any storage backend for easy get/set
 * todo: move to an independent package in future so it can be used across projects
 * @param backend The storage back-end, e.g. localStorage, sessionStorage
 * @param prefix Prefix for your storage values
 * @returns {{Proxy}}
 */
function getStorage({
  backend = requiredParam("backend"),
  prefix = requiredParam("prefix")
}) {
  const getPropKey = prop => `${prefix}.${prop}`;

  return new Proxy(
    {},
    {
      set: (obj, prop, value) => {
        const key = getPropKey(prop);
        if (value === null) {
          backend.removeItem(key);
        } else {
          obj[prop] = value;
          backend.setItem(key, value);
        }
        return true;
      },
      get: (obj, prop) => {
        if (prop === "clear") {
          return backend.clear.bind(backend);
        }

        return backend.getItem(getPropKey(prop));
      }
    }
  );
}

/**
 * Function to migrate usual storages to the new format
 * P.S. just adds prefixes to your current localStorage vars
 */
function migrateStorage({ storageBackend }) {
  const keysToMigrate = ["magicLogin", "customHistory", "user"];

  for (let i = 0; i < keysToMigrate.length; i++) {
    const currentKey = keysToMigrate[i];
    const storageValue = storageBackend.getItem(currentKey);
    if (storageValue) {
      Godaam[currentKey] = storageValue;
      localStorage.removeItem(currentKey);
    }
  }
}

const Godaam = getStorage({
  backend: localStorage,
  prefix: "certa"
});

if (!Godaam.storageMigrated) {
  migrateStorage({ storageBackend: localStorage });
  Godaam.storageMigrated = true;
}

export default Godaam;
