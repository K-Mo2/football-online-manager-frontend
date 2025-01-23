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
import toast from "react-hot-toast";
import { useEffect } from "react";

function Home() {
  const router = useRouter();
  const logout = useLogout();
  const { data, isLoading, isError, error } = useGetPlayers();
  const buyPlayer = useBuyPlayer();

  const players = data?.data?.players || [];
  players.map((player: Player) => (player.teamName = player?.team?.name));

  const handleBuyClick = function (id: GridRowId) {
    buyPlayer.mutate(id as number);
  };

  useEffect(() => {
    // Error State
    if (isError) {
      toast.error(error?.response?.data?.message || error.message);
    }

    if (buyPlayer.isError) {
      console.log(buyPlayer);
      toast.error(
        buyPlayer.error?.response?.data?.message || buyPlayer.error.message
      );
    }

    if (buyPlayer.isSuccess) {
      toast.success("Congratulation you bought a new player!");
    }
  }, [
    isLoading,
    buyPlayer.isPending,
    buyPlayer.isError,
    isError,
    buyPlayer.error,
    error,
    buyPlayer,
    buyPlayer.isSuccess,
  ]);

  // Loading State
  if (isLoading || buyPlayer.isPending) {
    return <LoadingSpinner />;
  }

  const columns: GridColDef<(typeof players)[number]>[] = [
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
      field: "teamName",
      headerName: "Team",
      width: 150,
      editable: false,
    },
    {
      field: "price",
      headerName: "Price",
      type: "number",
      width: 150,
      editable: false,
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Buy",
      width: 100,
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
      <h1 className="text-3xl font-bold mb-6 text-center">Transfer Market</h1>

      <div className="mb-8">
        <Box
          sx={{
            height: "auto",
            width: "60%",
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
