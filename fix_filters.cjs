const fs = require('fs');
let code = fs.readFileSync('src/components/SearchBar.tsx', 'utf8');

code = code.replace(/<option value="1">1\+ Banheiros<\/option>/, '<option value="1">1 Banheiro</option>');
code = code.replace(/<option value="2">2\+ Banheiros<\/option>/, '<option value="2">2 Banheiros</option>');
code = code.replace(/<option value="3">3\+ Banheiros<\/option>/, '<option value="3">3 Banheiros</option>');

code = code.replace(/<option value="1">1\+ Vagas<\/option>/, '<option value="1">1 Vaga</option>');
code = code.replace(/<option value="2">2\+ Vagas<\/option>/, '<option value="2">2 Vagas</option>');
code = code.replace(/<option value="3">3\+ Vagas<\/option>/, '<option value="3">3 Vagas</option>');

fs.writeFileSync('src/components/SearchBar.tsx', code);
