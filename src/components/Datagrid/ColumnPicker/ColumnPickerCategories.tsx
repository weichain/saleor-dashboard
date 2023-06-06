import { Box, Button, Text } from "@saleor/macaw-ui/next";
import React from "react";
import { FormattedMessage } from "react-intl";

import { ColumnPickerAvailableNodes } from "./ColumnPickerAvailableNodes";
import { ColumnPickerCategoryList } from "./ColumnPickerCategoryList";
import { ColumnPickerPagination } from "./ColumnPickerPagination";
import messages from "./messages";
import { useAvailableColumnsQuery } from "./useAvailableColumnsQuery";
import { useCategorySelection } from "./useCategorySelection";
import { ColumnCategory } from "./useColumns";
import { getExitIcon, getExitOnClick } from "./utils";

export interface ColumnPickerCategoriesProps {
  columnCategories: ColumnCategory[];
  columnPickerSettings: string[];
  onClose: () => void;
  onDynamicColumnSelect: (columns: string[]) => void;
}

export const ColumnPickerCategories = ({
  columnCategories,
  onClose,
  onDynamicColumnSelect,
  columnPickerSettings,
}: ColumnPickerCategoriesProps) => {
  const { currentCategory, setCurrentCategory } =
    useCategorySelection(columnCategories);
  const { query, setQuery } = useAvailableColumnsQuery(currentCategory);

  const changeHandler = (column: string) =>
    columnPickerSettings.includes(column)
      ? onDynamicColumnSelect(
          columnPickerSettings.filter(currentCol => currentCol !== column),
        )
      : onDynamicColumnSelect([...columnPickerSettings, column]);

  return (
    <Box
      backgroundColor="subdued"
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      __minHeight="502px"
    >
      <Box display="flex" flexDirection="column" height="100%">
        <Box
          display="flex"
          paddingX={7}
          paddingY={5}
          gap={5}
          alignItems="center"
        >
          <Button
            variant="tertiary"
            size="small"
            icon={getExitIcon(columnCategories, currentCategory)}
            onClick={getExitOnClick({
              columnCategories,
              currentCategory,
              setCurrentCategory,
              onClose,
            })}
          />
          <Text size="small">
            {currentCategory?.name ?? (
              <FormattedMessage {...messages.categories} />
            )}
          </Text>
        </Box>
        {currentCategory ? (
          <ColumnPickerAvailableNodes
            currentCategory={currentCategory}
            columnPickerSettings={columnPickerSettings}
            query={query}
            setQuery={setQuery}
            changeHandler={changeHandler}
          />
        ) : (
          <ColumnPickerCategoryList
            columnCategories={columnCategories}
            setCurrentCategory={setCurrentCategory}
          />
        )}
      </Box>
      {currentCategory && (
        <ColumnPickerPagination
          query={query}
          hasNextPage={currentCategory.hasNextPage}
          hasPreviousPage={currentCategory.hasPreviousPage}
          onNextPage={currentCategory.onNextPage}
          onPreviousPage={currentCategory.onPreviousPage}
        />
      )}
    </Box>
  );
};
