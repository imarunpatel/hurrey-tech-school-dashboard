import { Box, Container, Toolbar, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";

import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { auth, firestore } from "../../firebase-config";
import { doc, getDoc } from "firebase/firestore";
import { useAppDispatch } from "../store/hooks";
import { updateUser } from "../store/userSlice";
import { IUser } from "../models/user";

const drawerWidth = 240;

const MainLayout: React.FC = () => {
  const dispatch = useAppDispatch();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user: any) => {
      if (user) {
        getSelf(user);
      } else {
        navigate("/login");
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const getSelf = async (user: any) => {
    const docRef = doc(firestore, "users", user.uid);
    const data = (await getDoc(docRef)).data();
    if (data) {
      const finalData: IUser = {
        name: data.name,
        email: user.email,
        phone: data.phone,
        username: data.username,
        imgUrl: data.imgUrl ? data.imgUrl : "",
        updatedAt: data.updatedAt,
      };
      dispatch(updateUser(finalData));
    }
    setLoading(false);
  };

  return loading ? (
    <Container
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
      }}
    >
      <Typography variant="h1">Loading...</Typography>
    </Container>
  ) : (
    <Container maxWidth="lg">
      <Box>
        <Header handleDrawerOpen={() => setMobileOpen(!mobileOpen)} />
        <Sidebar isDrawerOpen={mobileOpen} onDrawerToggle={() => setMobileOpen(!mobileOpen)} />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            // p: 3,
            ml: "auto",
            width: { sm: `calc(100% - ${drawerWidth}px)` },
          }}
        >
          <Toolbar />
          <Box sx={{ pt: 4 }}>
            <Outlet />
          </Box>
        </Box>
      </Box>
      {/* dss */}
    </Container>
  );
};

export default MainLayout;
