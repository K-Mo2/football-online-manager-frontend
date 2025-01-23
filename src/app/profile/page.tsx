"use client";
import { useState } from "react";
import withAuth from "../../../hoc/withAuth";
import { useGetUserData, useLogout } from "../../../hooks/useAuth";
import { UpdatedRow } from "../../../types/types";
import Box from "@mui/material/Box";
import {
  DataGrid,
  GridActionsCellItem,
  GridColDef,
  GridEventListener,
  GridRowEditStopReasons,
  GridRowId,
  GridRowModel,
  GridRowModes,
  GridRowModesModel,
} from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Close";
import { useUpdatePlayer } from "../../../hooks/usePlayers";
import { useRouter } from "next/navigation";
import LoadingSpinner from "../../../components/LoadingSpinner";
import toast from "react-hot-toast";

function Profile() {
  const router = useRouter();
  const logout = useLogout();
  const { data, isLoading, isError, error } = useGetUserData();

  const teamPlayers = data?.data?.user?.team?.players || [];
  teamPlayers.map((el) => (el.team = data?.data.user.team.name));

  const [rows, setRows] = useState(teamPlayers);
  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});
  const updatePlayer = useUpdatePlayer();
  let currency = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });

  //   Loading State
  if (isLoading) {
    return <LoadingSpinner />;
  }

  // Error State
  if (isError) {
    toast.error(error?.response?.data?.message || error.message);
  }

  // Safely extract team players with optional chaining

  const handleRowEditStop: GridEventListener<"rowEditStop"> = (
    params,
    event
  ) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

  const handleEditClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };

  const handleSaveClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  };

  const handleCancelClick = (id: GridRowId) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });

    const editedRow = rows.find((row) => row.id === id);
    if (editedRow?.isNew) {
      setRows(rows.filter((row) => row.id !== id));
    }
  };

  const processRowUpdate = (newRow: GridRowModel) => {
    const updatedRow: UpdatedRow = { ...newRow, isNew: false };
    setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));

    updatePlayer.mutate({
      playerId: updatedRow.id!,
      price: updatedRow?.price,
      isMarketListed: updatedRow?.isMarketListed,
    });

    return updatedRow;
  };

  const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  const columns: GridColDef<(typeof teamPlayers)[number]>[] = [
    { field: "id", headerName: "ID", width: 150 },
    { field: "number", headerName: "Number", width: 150 },
    {
      field: "name",
      headerName: "Name",
      width: 150,
      editable: false,
    },
    {
      field: "position",
      headerName: "Position",
      width: 150,
      editable: false,
    },
    {
      field: "team",
      headerName: "Team",
      width: 150,
      editable: false,
    },
    {
      field: "price",
      headerName: "Price",
      type: "number",
      width: 150,
      editable: true,
    },
    {
      field: "isMarketListed",
      headerName: "For Sale",
      type: "boolean",
      width: 150,
      editable: true,
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      width: 100,
      cellClassName: "actions",
      getActions: ({ id }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

        if (isInEditMode) {
          return [
            <GridActionsCellItem
              key={id}
              icon={<SaveIcon />}
              label="Save"
              sx={{
                color: "primary.main",
              }}
              onClick={handleSaveClick(id)}
            />,
            <GridActionsCellItem
              key={id}
              icon={<CancelIcon />}
              label="Cancel"
              className="textPrimary"
              onClick={handleCancelClick(id)}
              color="inherit"
            />,
          ];
        }

        return [
          <GridActionsCellItem
            key={id}
            icon={<EditIcon />}
            label="Edit"
            className="textPrimary"
            onClick={handleEditClick(id)}
            color="inherit"
          />,
        ];
      },
    },
  ];

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="w-full h-full">
        <div className="w-full h-10 flex flex-row items-center justify-end mt-8">
          <div></div>
          <div
            onClick={() => router.push("/")}
            className="flex flex-row w-24 h-12 items-center justify-around mr-14 text-center rounded-md bg-indigo-600 px-3 py-1.5 text-lg font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 cursor-pointer"
          >
            <div>Market</div>
          </div>
          <div
            onClick={() => logout.mutate()}
            className="flex flex-row w-24 h-12 items-center justify-around mr-14 text-center rounded-md bg-black px-3 py-1.5 text-lg font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 cursor-pointer"
          >
            <div>Logout</div>
          </div>
        </div>
      </div>
      <h1 className="text-3xl font-bold mb-6 text-center">Team Players</h1>

      <div className="mb-8">
        <div className="m-2  relative left-20 bottom-10">
          <h2 className="text-xl font-semibold">
            Balance:{" "}
            <span className="text-blue-600">
              {currency.format(data?.data?.user?.balance) || 0}
            </span>
          </h2>
          <h2 className="text-xl font-semibold">
            Players Count:{" "}
            <span className="text-blue-600">{teamPlayers.length || 0}</span>
          </h2>
        </div>

        <Box
          sx={{
            height: "auto",
            width: "65%",
            alignSelf: "center",
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          <DataGrid
            rows={teamPlayers}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: 25,
                },
              },
            }}
            pageSizeOptions={[25]}
            disableRowSelectionOnClick
            editMode="row"
            rowModesModel={rowModesModel}
            onRowModesModelChange={handleRowModesModelChange}
            onRowEditStop={handleRowEditStop}
            processRowUpdate={processRowUpdate}
          />
        </Box>
      </div>

      {teamPlayers.length === 0 && (
        <div className="text-center text-gray-500">
          No players found in the team
        </div>
      )}
    </div>
  );
}

export default withAuth(Profile);
