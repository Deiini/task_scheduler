import React from 'react';
import { TextField, InputAdornment, Box, FormControl, InputLabel, Select, MenuItem, SelectChangeEvent } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

interface SearchFilterProps {
  search: string;
  onSearchChange: (value: string) => void;
  filterOptions?: { label: string; value: string }[];
  filterValue?: string;
  onFilterChange?: (value: string) => void;
}

export const SearchFilter: React.FC<SearchFilterProps> = ({
  search,
  onSearchChange,
  filterOptions,
  filterValue,
  onFilterChange,
}) => {
  const handleFilterChange = (event: SelectChangeEvent<string>) => {
    if (onFilterChange) {
      onFilterChange(event.target.value);
    }
  };

  return (
    <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
      <TextField
        placeholder="Rechercher..."
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        size="small"
        sx={{ minWidth: 300 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon color="action" />
            </InputAdornment>
          ),
        }}
      />
      {filterOptions && filterOptions.length > 0 && (
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Filtrer par</InputLabel>
          <Select value={filterValue || ''} onChange={handleFilterChange} label="Filtrer par">
            <MenuItem value="">
              <em>Tous</em>
            </MenuItem>
            {filterOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}
    </Box>
  );
};
