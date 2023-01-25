import { useFlags } from "@dashboard/hooks/useFlags";
import { sectionNames } from "@dashboard/intl";
import { asSortParams } from "@dashboard/utils/sort";
import { parse as parseQs } from "qs";
import React from "react";
import { useIntl } from "react-intl";
import { Route, RouteComponentProps, Switch } from "react-router-dom";

import { WindowTitle } from "../components/WindowTitle";
import {
  orderDraftListPath,
  OrderDraftListUrlQueryParams,
  OrderDraftListUrlSortField,
  orderFulfillPath,
  OrderFulfillUrlQueryParams,
  orderGrantRefundEditPath,
  orderGrantRefundPath,
  orderListPath,
  OrderListUrlQueryParams,
  OrderListUrlSortField,
  orderPath,
  orderRefundPath,
  orderReturnPath,
  orderSettingsPath,
  OrderUrlQueryParams,
} from "./urls";
import OrderDetailsComponent from "./views/OrderDetails";
import OrderDraftListComponent from "./views/OrderDraftList";
import OrderGrantRefundEditComponent from "./views/OrderEditGrantRefund";
import OrderFulfillComponent from "./views/OrderFulfill";
import OrderGrantRefundComponent from "./views/OrderGrantRefund";
import OrderListComponent from "./views/OrderList";
import OrderRefundComponent from "./views/OrderRefund";
import OrderReturnComponent from "./views/OrderReturn";
import OrderSendRefundComponent from "./views/OrderSendRefund";
import OrderSettings from "./views/OrderSettings";

const OrderList: React.FC<RouteComponentProps<any>> = ({ location }) => {
  const qs = parseQs(location.search.substr(1));
  const params: OrderListUrlQueryParams = asSortParams(
    qs,
    OrderListUrlSortField,
    OrderListUrlSortField.number,
    false,
  );
  return <OrderListComponent params={params} />;
};
const OrderDraftList: React.FC<RouteComponentProps<any>> = ({ location }) => {
  const qs = parseQs(location.search.substr(1));
  const params: OrderDraftListUrlQueryParams = asSortParams(
    qs,
    OrderDraftListUrlSortField,
    OrderDraftListUrlSortField.number,
    false,
  );

  return <OrderDraftListComponent params={params} />;
};

const OrderDetails: React.FC<RouteComponentProps<any>> = ({
  location,
  match,
}) => {
  const qs = parseQs(location.search.substr(1));
  const params: OrderUrlQueryParams = qs;
  const id = match.params.id;

  return <OrderDetailsComponent id={decodeURIComponent(id)} params={params} />;
};

const OrderFulfill: React.FC<RouteComponentProps<any>> = ({
  location,
  match,
}) => {
  const qs = parseQs(location.search.substr(1));
  const params: OrderFulfillUrlQueryParams = qs;
  return (
    <OrderFulfillComponent
      orderId={decodeURIComponent(match.params.id)}
      params={params}
    />
  );
};

const OrderSendRefund: React.FC<RouteComponentProps<any>> = ({ match }) => {
  const { orderTransactions } = useFlags(["orderTransactions"]);

  if (orderTransactions.enabled) {
    return (
      <OrderSendRefundComponent orderId={decodeURIComponent(match.params.id)} />
    );
  }

  return <OrderRefundComponent orderId={decodeURIComponent(match.params.id)} />;
};

const OrderReturn: React.FC<RouteComponentProps<any>> = ({ match }) => (
  <OrderReturnComponent orderId={decodeURIComponent(match.params.id)} />
);

const OrderGrantRefund: React.FC<RouteComponentProps<any>> = ({ match }) => (
  <OrderGrantRefundComponent orderId={decodeURIComponent(match.params.id)} />
);

const OrderGrantRefundEdit: React.FC<RouteComponentProps<any>> = ({
  match,
}) => (
  <OrderGrantRefundEditComponent
    orderId={decodeURIComponent(match.params.orderId)}
    grantRefundId={decodeURIComponent(match.params.refundId)}
  />
);

const Component = () => {
  const intl = useIntl();

  return (
    <>
      <WindowTitle title={intl.formatMessage(sectionNames.orders)} />
      <Switch>
        <Route exact path={orderSettingsPath} component={OrderSettings} />
        <Route exact path={orderDraftListPath} component={OrderDraftList} />
        <Route exact path={orderListPath} component={OrderList} />
        <Route path={orderFulfillPath(":id")} component={OrderFulfill} />
        {/* TODO: switch based on feature flags */}
        <Route path={orderReturnPath(":id")} component={OrderReturn} />
        <Route path={orderRefundPath(":id")} component={OrderSendRefund} />
        <Route
          path={orderGrantRefundEditPath(":orderId", ":refundId")}
          component={OrderGrantRefundEdit}
        />
        <Route
          path={orderGrantRefundPath(":id")}
          component={OrderGrantRefund}
        />
        <Route path={orderPath(":id")} component={OrderDetails} />
      </Switch>
    </>
  );
};

export default Component;
