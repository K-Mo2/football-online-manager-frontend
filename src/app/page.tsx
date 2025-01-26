"use client";
import withAuth from "../../hoc/withAuth";
import Box from "@mui/material/Box";
import {
  DataGrid,
  GridActionsCellItem,
  GridColDef,
  GridRowId,
} from "@mui/x-data-grid";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { useGetPlayers, useBuyPlayer } from "../../hooks/usePlayers";
import { useRouter } from "next/navigation";
import { useLogout } from "../../hooks/useAuth";
import { Player } from "../../types/types";
import LoadingSpinner from "../../components/LoadingSpinner";
import { useEffect, useState } from "react";
import AlertComponent from "../../components/AlertComponent";

function Home() {
  const router = useRouter();
  const logout = useLogout();
  const { data, isLoading, isError, error } = useGetPlayers();
  const buyPlayer = useBuyPlayer();
  const [alert, setAlert] = useState({ type: "", message: "" });
  const players = data?.data?.players || [];
  players.map((player: Player) => (player.teamName = player?.team?.name));

  const handleBuyClick = function (id: GridRowId) {
    buyPlayer.mutate(id as number);
  };

  useEffect(() => {
    // Error State
    if (isError) {
      setAlert({
        type: "error",
        message: error?.response?.data?.message || error.message,
      });
    }

    if (buyPlayer.isError) {
      setAlert({
        type: "error",
        message:
          buyPlayer.error?.response?.data?.message || buyPlayer.error.message,
      });
    }

    if (buyPlayer.isSuccess) {
      setAlert({
        type: "success",
        message: "Congratulation you bought a new player!",
      });
    }
  }, [buyPlayer.isError, isError, buyPlayer.isSuccess]);

  // Loading State
  if (isLoading || buyPlayer.isPending) {
    return <LoadingSpinner />;
  }

  const columns: GridColDef<(typeof players)[number]>[] = [
    { field: "id", headerName: "ID", flex: 1 },
    { field: "number", headerName: "Number", flex: 1 },
    {
      field: "name",
      headerName: "Name",
      editable: false,
      flex: 1,
    },
    {
      field: "position",
      headerName: "Position",
      editable: false,
      flex: 1,
    },
    {
      field: "teamName",
      headerName: "Team",
      editable: false,
      flex: 1,
    },
    {
      field: "price",
      headerName: "Price",
      type: "number",
      editable: false,
      flex: 1,
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Buy",
      flex: 1,
      cellClassName: "actions",
      getActions: ({ id }) => {
        return [
          <GridActionsCellItem
            key={id}
            icon={<ShoppingCartIcon />}
            label="Buy"
            className="textPrimary"
            onClick={() => handleBuyClick(id)}
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
            onClick={() => router.push("/profile")}
            className="flex flex-row w-24 h-12 items-center justify-around mr-14 text-center rounded-md bg-indigo-600 px-3 py-1.5 text-lg font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 cursor-pointer"
          >
            <div>Profile</div>
          </div>
          <div
            onClick={() => logout.mutate()}
            className="flex flex-row w-24 h-12 items-center justify-around mr-14 text-center rounded-md bg-black px-3 py-1.5 text-lg font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 cursor-pointer"
          >
            <div>Logout</div>
          </div>
        </div>
      </div>
      {alert.message.length > 0 && (
        <AlertComponent alertType={alert.type} message={alert.message} />
      )}
      <h1 className="text-3xl font-bold mb-6 text-center">Transfer Market</h1>
      <div className="mb-8">
        <Box
          sx={{
            height: "auto",
            width: "95%",
            alignSelf: "center",
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          <DataGrid
            rows={players}
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
            sx={{}}
          />
        </Box>
      </div>

      {players.length === 0 && (
        <div className="text-center text-gray-500">
          No players found in the team
        </div>
      )}
    </div>
  );
}

export default withAuth(Home);
