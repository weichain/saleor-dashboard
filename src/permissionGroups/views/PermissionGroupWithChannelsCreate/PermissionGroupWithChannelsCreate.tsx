import { useUser } from "@dashboard/auth";
import useAppChannel from "@dashboard/components/AppLayout/AppChannelContext";
import { WindowTitle } from "@dashboard/components/WindowTitle";
import { usePermissionGroupWithChannelsCreateMutation } from "@dashboard/graphql";
import useNavigator from "@dashboard/hooks/useNavigator";
import useNotifier from "@dashboard/hooks/useNotifier";
import useShop from "@dashboard/hooks/useShop";
import { extractMutationErrors } from "@dashboard/misc";
import { PermissionWithChannelsData } from "@dashboard/permissionGroups/components/PermissonGroupWithChannelsDetailsPage";
import React from "react";
import { useIntl } from "react-intl";

import {
  PermissionGroupWithChannelsCreateFormData,
  PermissionGroupWithChannelsCreatePage,
} from "../../components/PermissionGroupWithChannelsCreatePage";
import { permissionGroupDetailsUrl } from "../../urls";

export const PermissionGroupWithChannelsCreate: React.FC = () => {
  const navigate = useNavigator();
  const notify = useNotifier();
  const intl = useIntl();
  const shop = useShop();
  const user = useUser();

  const [createPermissionGroup, createPermissionGroupResult] =
    usePermissionGroupWithChannelsCreateMutation({
      onCompleted: data => {
        if (data?.permissionGroupCreate?.errors.length === 0) {
          notify({
            status: "success",
            text: intl.formatMessage({
              id: "eUjFjW",
              defaultMessage: "Permission group created",
            }),
          });
          navigate(
            permissionGroupDetailsUrl(data.permissionGroupCreate.group.id),
          );
        }
      },
    });

  const errors =
    createPermissionGroupResult?.data?.permissionGroupCreate?.errors || [];

  const { availableChannels } = useAppChannel();

  const onSubmit = (formData: PermissionGroupWithChannelsCreateFormData) =>
    extractMutationErrors(
      createPermissionGroup({
        variables: {
          input: {
            addPermissions: formData.hasFullAccess
              ? shop.permissions.map(perm => perm.code)
              : formData.permissions,
            addUsers: [],
            name: formData.name,
            addChannels: formData.channels,
            restrictedAccessToChannels: formData.hasRestrictedChannels,
          },
        },
      }),
    );

  const userPermissions = user?.user.userPermissions.map(p => p.code) || [];

  const permissions: PermissionWithChannelsData[] =
    shop?.permissions.map(
      p =>
        ({
          ...p,
          disabled: !userPermissions.includes(p.code),
          lastSource: false,
        } as PermissionWithChannelsData),
    ) || [];

  return (
    <>
      <WindowTitle
        title={intl.formatMessage({
          id: "Irflxf",
          defaultMessage: "Create category",
          description: "window title",
        })}
      />
      <PermissionGroupWithChannelsCreatePage
        errors={errors as any}
        disabled={createPermissionGroupResult.loading}
        permissions={permissions}
        channels={availableChannels}
        saveButtonBarState={createPermissionGroupResult.status}
        onSubmit={onSubmit}
      />
    </>
  );
};
