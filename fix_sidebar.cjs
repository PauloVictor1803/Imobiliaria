const fs = require('fs');

let content = fs.readFileSync('src/components/Sidebar.tsx', 'utf8');

const target = `<button
            onClick={() => { setActiveTab(activeTab === 'settings' ? 'dashboard' : 'settings'); onClose?.(); }}
            className={\`w-full flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-colors \${
              activeTab === 'settings'
                ? 'bg-blue-900 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }\`}
          >
            <Settings className="w-5 h-5 mr-3" />
            Configurações
          </button>`;

const replacement = `{isAdmin && (
          <button
            onClick={() => { setActiveTab(activeTab === 'settings' ? 'dashboard' : 'settings'); onClose?.(); }}
            className={\`w-full flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-colors \${
              activeTab === 'settings'
                ? 'bg-blue-900 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }\`}
          >
            <Settings className="w-5 h-5 mr-3" />
            Configurações
          </button>
          )}`;

content = content.replace(target, replacement);

fs.writeFileSync('src/components/Sidebar.tsx', content);
