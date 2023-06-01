import {
  Box,
  Button,
  Popover,
  sprinkles,
  TableEditIcon,
  Text,
  vars,
} from "@saleor/macaw-ui/next";
import React, { useState } from "react";
import { FormattedMessage } from "react-intl";

import { AvailableColumn } from "../types";
import { ColumnPickerCategories } from "./ColumnPickerCategories";
import { ColumnPickerDynamicColumns } from "./ColumnPickerDynamicColumns";
import { ColumnPickerStaticColumns } from "./ColumnPickerStaticColumns";
import messages from "./messages";
import { ColumnCategory } from "./useColumns";

export interface ColumnPickerProps {
  staticColumns: AvailableColumn[];
  dynamicColumns?: AvailableColumn[];
  selectedColumns: string[];
  columnCategories?: ColumnCategory[];
  columnPickerSettings?: string[];
  onSave: (columns: string[]) => void;
  onDynamicColumnSelect?: (columns: string[]) => void;
}

export const ColumnPicker: React.FC<ColumnPickerProps> = ({
  staticColumns,
  selectedColumns,
  columnCategories,
  dynamicColumns,
  columnPickerSettings,
  onDynamicColumnSelect,
  onSave,
}) => {
  const [pickerOpen, setPickerOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const handleToggle = (id: string) =>
    selectedColumns.includes(id)
      ? onSave(selectedColumns.filter(currentId => currentId !== id))
      : onSave([...selectedColumns, id]);

  return (
    <Popover
      open={pickerOpen}
      onOpenChange={() => {
        setExpanded(false);
        setPickerOpen(isPickerOpen => !isPickerOpen);
      }}
    >
      <Popover.Trigger>
        <Button
          variant="tertiary"
          icon={<TableEditIcon />}
          __backgroundColor={
            pickerOpen
              ? vars.colors.background.interactiveNeutralSecondaryPressing
              : undefined
          }
          __borderColor={
            pickerOpen ? vars.colors.border.neutralSubdued : undefined
          }
        />
      </Popover.Trigger>
      <Popover.Content className={sprinkles({ margin: 4 })}>
        <Box
          display="grid"
          gridTemplateColumns={expanded ? 2 : 1}
          overflow="hidden"
        >
          {expanded && (
            <ColumnPickerCategories
              columnCategories={columnCategories}
              columnPickerSettings={columnPickerSettings}
              onDynamicColumnSelect={onDynamicColumnSelect}
              onClose={() => setExpanded(false)}
            />
          )}
          <Box __minWidth="320px" backgroundColor="plain" padding={7}>
            <Box marginBottom={6}>
              <Text variant="caption" size="small" color="textNeutralSubdued">
                <FormattedMessage {...messages.column} />
              </Text>
            </Box>
            <ColumnPickerStaticColumns
              staticColumns={staticColumns}
              handleToggle={handleToggle}
              selectedColumns={selectedColumns}
            />
            {columnCategories && (
              <ColumnPickerDynamicColumns
                dynamicColumns={dynamicColumns}
                selectedColumns={selectedColumns}
                setExpanded={setExpanded}
                handleToggle={handleToggle}
              />
            )}
          </Box>
        </Box>
      </Popover.Content>
    </Popover>
  );
};
