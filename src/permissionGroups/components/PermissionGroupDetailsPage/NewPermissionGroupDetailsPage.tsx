import AccountPermissions from "@dashboard/components/AccountPermissions";
import { TopNav } from "@dashboard/components/AppLayout/TopNav";
import { ChannelPermission } from "@dashboard/components/ChannelPermission";
import Form from "@dashboard/components/Form";
import FormSpacer from "@dashboard/components/FormSpacer";
import { DetailPageLayout } from "@dashboard/components/Layouts";
import Savebar from "@dashboard/components/Savebar";
import {
  ChannelFragment,
  PermissionEnum,
  PermissionGroupDetailsFragment,
  PermissionGroupErrorFragment,
  UserPermissionFragment,
} from "@dashboard/graphql";
import { NewPermissionGroupDetailsFragment } from "@dashboard/graphql/types.channelPermissions.generated";
import { SubmitPromise } from "@dashboard/hooks/useForm";
import useNavigator from "@dashboard/hooks/useNavigator";
import {
  MembersListUrlSortField,
  permissionGroupListUrl,
} from "@dashboard/permissionGroups/urls";
import {
  extractPermissionCodes,
  isGroupFullAccess,
} from "@dashboard/permissionGroups/utils";
import { ListActions, SortPage } from "@dashboard/types";
import { getFormErrors } from "@dashboard/utils/errors";
import getPermissionGroupErrorMessage from "@dashboard/utils/errors/permissionGroups";
import { ConfirmButtonTransitionState } from "@saleor/macaw-ui";
import { Box } from "@saleor/macaw-ui/next";
import React from "react";
import { useIntl } from "react-intl";

import PermissionGroupInfo from "../PermissionGroupInfo";
import PermissionGroupMemberList from "../PermissionGroupMemberList";

export interface NewPermissionGroupDetailsPageFormData {
  name: string;
  hasFullAccess: boolean;
  hasAllChannels: boolean;
  isActive: boolean;
  permissions: PermissionEnum[];
  users: PermissionGroupDetailsFragment["users"];
  channels: ChannelFragment[];
}

export interface NewPermissionData
  extends Omit<UserPermissionFragment, "__typename"> {
  lastSource?: boolean;
  disabled?: boolean;
}

export interface NewPermissionGroupDetailsPageProps
  extends ListActions,
    SortPage<MembersListUrlSortField> {
  channels: ChannelFragment[];
  disabled: boolean;
  errors: PermissionGroupErrorFragment[];
  members: PermissionGroupDetailsFragment["users"];
  permissionGroup: NewPermissionGroupDetailsFragment;
  permissions: NewPermissionData[];
  permissionsExceeded: boolean;
  saveButtonBarState: ConfirmButtonTransitionState;
  onAssign: () => void;
  onUnassign: (ids: string[]) => void;
  onSubmit: (data: NewPermissionGroupDetailsPageFormData) => SubmitPromise;
}

export const NewPermissionGroupDetailsPage: React.FC<
  NewPermissionGroupDetailsPageProps
> = ({
  disabled,
  errors,
  members,
  onSubmit,
  permissionGroup,
  permissions,
  permissionsExceeded,
  saveButtonBarState,
  channels,
  ...listProps
}) => {
  const intl = useIntl();
  const navigate = useNavigator();

  const initialForm: NewPermissionGroupDetailsPageFormData = {
    hasFullAccess: isGroupFullAccess(permissionGroup, permissions),
    hasAllChannels: !permissionGroup?.restrictedAccessToChannels ?? false,
    channels: permissionGroup?.accessibleChannels ?? [],
    isActive: false,
    name: permissionGroup?.name || "",
    permissions: extractPermissionCodes(permissionGroup),
    users: members,
  };

  const formErrors = getFormErrors(["addPermissions"], errors);
  const permissionsError = getPermissionGroupErrorMessage(
    formErrors.addPermissions,
    intl,
  );

  return (
    <Form confirmLeave initial={initialForm} onSubmit={onSubmit}>
      {({ data, change, submit }) => (
        <DetailPageLayout>
          <TopNav
            href={permissionGroupListUrl()}
            title={permissionGroup?.name}
          />
          <DetailPageLayout.Content>
            <PermissionGroupInfo
              data={data}
              disabled={disabled}
              errors={errors}
              onChange={change}
            />
            <FormSpacer />
            <PermissionGroupMemberList
              disabled={disabled}
              {...listProps}
              users={data?.users || []}
            />
          </DetailPageLayout.Content>
          <DetailPageLayout.RightSidebar>
            <Box display="flex" flexDirection="column" height="100%">
              <Box overflow="hidden" __maxHeight="50%">
                <AccountPermissions
                  permissionsExceeded={permissionsExceeded}
                  data={data}
                  disabled={disabled}
                  permissions={permissions}
                  onChange={change}
                  errorMessage={permissionsError}
                  fullAccessLabel={intl.formatMessage({
                    id: "mAabef",
                    defaultMessage: "Group has full access to the store",
                    description: "checkbox label",
                  })}
                  description={intl.formatMessage({
                    id: "CYZse9",
                    defaultMessage:
                      "Expand or restrict group's permissions to access certain part of saleor system.",
                    description: "card description",
                  })}
                />
              </Box>
              <Box overflow="hidden" __maxHeight="50%">
                <ChannelPermission
                  description="Expand or restrict channels permissions"
                  fullAccessLabel="Group has full access to all channels"
                  channels={channels}
                  onChange={change}
                  disabled={disabled}
                  data={data}
                />
              </Box>
            </Box>
          </DetailPageLayout.RightSidebar>
          <div>
            <Savebar
              onCancel={() => navigate(permissionGroupListUrl())}
              onSubmit={submit}
              state={saveButtonBarState}
              disabled={disabled}
            />
          </div>
        </DetailPageLayout>
      )}
    </Form>
  );
};
