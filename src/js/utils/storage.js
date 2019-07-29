/**
 * Returns a proxy for any storage backend for easy get/set
 * todo: move to an independent package in future so it can be used across projects
 * @param backend The storage back-end, e.g. localStorage, sessionStorage
 * @param prefix Prefix for your storage values
 * @returns {{Proxy}}
 */
function getStorage({ backend, prefix }) {
  if (!prefix) {
    throw new Error("Invalid prefix provided for storage proxy");
  }

  const clear = () => {
    return backend.clear;
  };

  const getPropKey = prop => {
    return `${prefix}.${prop}`;
  };

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
      },
      get: (obj, prop) => {
        if (prop === "clear") {
          return clear;
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
function migrateStorage({ backend: storageBackend }) {
  for (let i = 0; i < storageBackend.length; i++) {
    const storageKey = storageBackend.key(i);
    Godaam[storageKey] = storageBackend.getItem(storageKey);
    storageBackend.removeItem(storageKey);
  }
}

const Godaam = getStorage({
  backend: localStorage,
  prefix: "certa"
});

if (!Godaam.storageMigrated) {
  migrateStorage({ backend: localStorage });
  Godaam.storageMigrated = true;
}

export default Godaam;
