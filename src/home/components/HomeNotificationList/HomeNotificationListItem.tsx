import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight";
import { Box, List, sprinkles, Text } from "@saleor/macaw-ui/next";
import React, { ReactNode } from "react";
import { Link } from "react-router-dom";

interface HomeNotificationListItemProps {
  dataTestId?: string;
  linkUrl: string;
  children: ReactNode;
}

export const HomeNotificationListItem = ({
  dataTestId,
  linkUrl,
  children,
}: HomeNotificationListItemProps) => (
  <List.Item
    borderColor="neutralPlain"
    borderWidth={1}
    paddingX={5}
    paddingY={4}
    borderBottomStyle="solid"
    data-test-id={dataTestId}
  >
    <Link className={sprinkles({ width: "100%" })} to={linkUrl}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        width="100%"
      >
        <Text size="small">{children}</Text>
        <KeyboardArrowRight />
      </Box>
    </Link>
  </List.Item>
);
