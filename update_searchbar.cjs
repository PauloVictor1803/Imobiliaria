const fs = require('fs');
let code = fs.readFileSync('src/components/SearchBar.tsx', 'utf8');

code = code.replace(
  "interface SearchBarProps {",
  "interface SearchBarProps {\n  className?: string;"
);

code = code.replace(
  "export const SearchBar: React.FC<SearchBarProps> = ({ searchQuery, setSearchQuery, filters, setFilters }) => {",
  "export const SearchBar: React.FC<SearchBarProps> = ({ searchQuery, setSearchQuery, filters, setFilters, className = \"absolute top-4 left-4 z-[400]\" }) => {"
);

code = code.replace(
  /<div className="absolute top-4 left-4 z-\[400\]" ref=\{filterRef\}>/,
  "<div className={className} ref={filterRef}>"
);

fs.writeFileSync('src/components/SearchBar.tsx', code);
