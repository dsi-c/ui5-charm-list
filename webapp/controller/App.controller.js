sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/ui/Device",
    "sap/ui/model/Filter",
    "sap/ui/model/Sorter",
    "sap/ui/model/json/JSONModel",
    "sap/m/Menu",
    "sap/m/MenuItem",
    "sap/m/MessageToast",
    "sap/ui/core/Fragment",
  ],
  function (
    Controller,
    Device,
    Filter,
    Sorter,
    JSONModel,
    Menu,
    MenuItem,
    MessageToast,
    Fragment /*, Formatter*/,
  ) {
    "use strict";

    var SettingsDialogController = Controller.extend(
      "ui5.application.controller.App",
      {
        handleSortButtonPressed: function () {
          this.pDialog ??= this.loadFragment({
            name: "ui5.application.view.SortDialog",
          });

          this.pDialog.then((oDialog) => oDialog.open());
        },

        handleFilterButtonPressed: function () {
          this.getViewSettingsDialog(
            "sap.m.sample.TableViewSettingsDialog.FilterDialog",
          ).then(function (oViewSettingsDialog) {
            oViewSettingsDialog.open();
          });
        },

        handleSortDialogConfirm: function (oEvent) {
          var oTable = this.byId("CharmList"),
            mParams = oEvent.getParameters(),
            oBinding = oTable.getBinding("items"),
            sPath,
            bDescending,
            aSorters = [];

          sPath = mParams.sortItem.getKey();
          bDescending = mParams.sortDescending;
          aSorters.push(new Sorter(sPath, bDescending));

          // apply the selected sort and group settings
          oBinding.sort(aSorters);
        },

        handleFilterDialogConfirm: function (oEvent) {
          var oTable = this.byId("idProductsTable"),
            mParams = oEvent.getParameters(),
            oBinding = oTable.getBinding("items"),
            aFilters = [];

          mParams.filterItems.forEach(function (oItem) {
            var aSplit = oItem.getKey().split("___"),
              sPath = aSplit[0],
              sOperator = aSplit[1],
              sValue1 = aSplit[2],
              sValue2 = aSplit[3],
              oFilter = new Filter(sPath, sOperator, sValue1, sValue2);
            aFilters.push(oFilter);
          });

          // apply filter settings
          oBinding.filter(aFilters);

          // update filter bar
          this.byId("vsdFilterBar").setVisible(aFilters.length > 0);
          this.byId("vsdFilterLabel").setText(mParams.filterString);
        },

        handleGroupDialogConfirm: function (oEvent) {
          var oTable = this.byId("idProductsTable"),
            mParams = oEvent.getParameters(),
            oBinding = oTable.getBinding("items"),
            sPath,
            bDescending,
            vGroup,
            aGroups = [];

          if (mParams.groupItem) {
            sPath = mParams.groupItem.getKey();
            bDescending = mParams.groupDescending;
            vGroup = this.mGroupFunctions[sPath];
            aGroups.push(new Sorter(sPath, bDescending, vGroup));
            // apply the selected group settings
            oBinding.sort(aGroups);
          } else if (this.groupReset) {
            oBinding.sort();
            this.groupReset = false;
          }
        },

        onToggleContextMenu: function (oEvent) {
          var oToggleButton = oEvent.getSource();
          if (oEvent.getParameter("pressed")) {
            oToggleButton.setTooltip("Disable Custom Context Menu");
            this.byId("idProductsTable").setContextMenu(
              new Menu({
                items: [
                  new MenuItem({ text: "{Name}" }),
                  new MenuItem({ text: "{ProductId}" }),
                ],
              }),
            );
          } else {
            oToggleButton.setTooltip("Enable Custom Context Menu");
            this.byId("idProductsTable").destroyContextMenu();
          }
        },

        onActionItemPress: function () {
          MessageToast.show("Action Item Pressed");
        },
      },
    );

    return SettingsDialogController;
  },
);
