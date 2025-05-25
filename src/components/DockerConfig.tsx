import React, { useState } from 'react';

export interface DockerConfig {
  os: 'windows' | 'linux' | 'mac';
  ports: {
    n8n: number;
    admin: number;
  };
  security: {
    https: boolean;
    auth: boolean;
    encryption: boolean;
  };
}

const defaultConfig: DockerConfig = {
  os: 'linux',
  ports: { n8n: 5678, admin: 3000 },
  security: { https: false, auth: false, encryption: false },
};

export const DockerConfigComponent: React.FC = () => {
  const [config, setConfig] = useState<DockerConfig>(defaultConfig);
  const [errors, setErrors] = useState<{ n8n?: string; admin?: string }>({});
  const [loading, setLoading] = useState(false);

  const handlePortChange = (key: 'n8n' | 'admin', value: string) => {
    const num = Number(value);
    const isValid = num >= 1000 && num <= 65535;
    setErrors((prev) => ({ ...prev, [key]: isValid ? undefined : 'Port must be between 1000 and 65535' }));
    setConfig((prev) => ({ ...prev, ports: { ...prev.ports, [key]: num } }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (Object.values(errors).some(Boolean)) return;
    setLoading(true);
    setTimeout(() => setLoading(false), 1000);
  };

  return (
    <div className="max-w-xl mx-auto p-4 text-gray-800">
      <h1 className="text-2xl font-bold mb-4 text-blue-600">Configuration Docker - N8N Generator</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <section>
          <h2 className="text-lg font-semibold mb-2">Système d'exploitation</h2>
          <div className="flex space-x-4">
            {(
              [
                { label: 'windows', icon: '🪟' },
                { label: 'linux', icon: '🐧' },
                { label: 'mac', icon: '🍎' },
              ] as const
            ).map((os) => (
              <label key={os.label} className="flex items-center space-x-1 cursor-pointer">
                <input
                  type="radio"
                  name="os"
                  value={os.label}
                  checked={config.os === os.label}
                  onChange={() => setConfig({ ...config, os: os.label })}
                  className="form-radio text-blue-500"
                />
                <span className="capitalize flex items-center space-x-1">
                  <span>{os.icon}</span>
                  <span>{os.label}</span>
                </span>
              </label>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-2">Configuration Ports</h2>
          <div className="space-y-2">
            <div>
              <label className="block text-sm font-medium">N8N</label>
              <input
                type="number"
                value={config.ports.n8n}
                onChange={(e) => handlePortChange('n8n', e.target.value)}
                className="mt-1 w-full rounded border-gray-300"
              />
              {errors.n8n && <p className="text-red-500 text-sm">{errors.n8n}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium">Admin</label>
              <input
                type="number"
                value={config.ports.admin}
                onChange={(e) => handlePortChange('admin', e.target.value)}
                className="mt-1 w-full rounded border-gray-300"
              />
              {errors.admin && <p className="text-red-500 text-sm">{errors.admin}</p>}
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-2">Options Sécurité</h2>
          <div className="space-y-1">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={config.security.https}
                onChange={(e) => setConfig({ ...config, security: { ...config.security, https: e.target.checked } })}
                className="form-checkbox text-blue-500"
              />
              <span>HTTPS</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={config.security.auth}
                onChange={(e) => setConfig({ ...config, security: { ...config.security, auth: e.target.checked } })}
                className="form-checkbox text-blue-500"
              />
              <span>Auth renforcée</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={config.security.encryption}
                onChange={(e) => setConfig({ ...config, security: { ...config.security, encryption: e.target.checked } })}
                className="form-checkbox text-blue-500"
              />
              <span>Chiffrement</span>
            </label>
          </div>
        </section>

        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Chargement...' : 'Valider'}
        </button>
      </form>

      <div className="mt-6">
        <h2 className="text-lg font-semibold mb-2">Prévisualisation</h2>
        <pre className="bg-gray-100 p-4 rounded text-sm transition-all duration-300">
          {JSON.stringify(config, null, 2)}
        </pre>
      </div>
    </div>
  );
};

export default DockerConfigComponent;
