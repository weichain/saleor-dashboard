import { CircularProgress } from "@material-ui/core";
import {
  ArrowLeftIcon,
  Box,
  Button,
  Checkbox,
  CloseIcon,
  List,
  SearchInput,
  Text,
} from "@saleor/macaw-ui/next";
import React from "react";

import { ColumnCategory } from "./utils";

export interface NewColumnPickerCategoriesProps {
  columnCategories: ColumnCategory[];
  customColumnSettings: string[];
  onClose: () => void;
  onCustomColumnSelect: (columns: string[]) => void;
}

const getExitIcon = (columnCategories, selectedCategory) => {
  if (columnCategories.length === 1) {
    return <CloseIcon />;
  }
  if (selectedCategory) {
    return <ArrowLeftIcon />;
  } else {
    return <CloseIcon />;
  }
};

const getExitOnClick = ({
  columnCategories,
  selectedCategory,
  setSelectedCategory,
  onClose,
}) => {
  if (columnCategories.length === 1) {
    return onClose;
  }
  if (selectedCategory) {
    return () => setSelectedCategory(undefined);
  } else {
    return onClose;
  }
};

export const NewColumnPickerCategories: React.FC<
  NewColumnPickerCategoriesProps
> = ({
  columnCategories,
  onClose,
  onCustomColumnSelect,
  customColumnSettings,
}) => {
  const [selectedCategory, setSelectedCategory] = React.useState<string>();

  const currentCategory = React.useMemo(
    () => columnCategories.find(category => category.name === selectedCategory),
    [columnCategories, selectedCategory],
  );

  const changeHandler = (column: string) => {
    if (customColumnSettings.includes(column)) {
      onCustomColumnSelect(
        customColumnSettings.filter(currentCol => currentCol !== column),
      );
    } else {
      onCustomColumnSelect([...customColumnSettings, column]);
    }
  };

  React.useEffect(() => {
    // Preselect category when there is only one
    if (columnCategories.length === 1) {
      setSelectedCategory(columnCategories[0].name);
    }
  }, [columnCategories]);

  return (
    <Box backgroundColor="subdued">
      <Box display="flex" paddingX={7} paddingY={5} gap={5} alignItems="center">
        <Button
          variant="tertiary"
          size="small"
          icon={getExitIcon(columnCategories, selectedCategory)}
          onClick={getExitOnClick({
            columnCategories,
            selectedCategory,
            setSelectedCategory,
            onClose,
          })}
        />
        <Text size="small">{selectedCategory ?? "Categories"}</Text>
      </Box>
      {selectedCategory ? (
        <>
          <Box paddingX={7} style={{ boxSizing: "border-box" }}>
            <SearchInput
              size="small"
              placeholder="Search for columns"
              onChange={e => currentCategory.onSearch(e.target.value ?? "")}
            />
          </Box>
          <Box padding={8}>
            {currentCategory.availableNodes === undefined ? (
              <CircularProgress />
            ) : (
              <>
                {currentCategory.availableNodes.map(node => (
                  <Box
                    display="flex"
                    alignItems="center"
                    padding={5}
                    gap={6}
                    key={node.id}
                  >
                    <Checkbox
                      onCheckedChange={() => changeHandler(node.id)}
                      checked={customColumnSettings.includes(node.id)}
                    >
                      <Text size="small" color="textNeutralSubdued">
                        {node.title}
                      </Text>
                    </Checkbox>
                  </Box>
                ))}

                {/* TODO: Pagination */}
              </>
            )}
          </Box>
        </>
      ) : (
        <List padding={8}>
          {columnCategories.map(category => (
            <List.Item
              key={category.prefix}
              padding={4}
              borderRadius={3}
              onClick={() => setSelectedCategory(category.name)}
            >
              <Text size="small">{category.name}</Text>
            </List.Item>
          ))}
        </List>
      )}
    </Box>
  );
};
