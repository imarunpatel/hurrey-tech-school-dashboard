import {
  Avatar,
  Box,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
} from "@mui/material";
import React, { useEffect } from "react";
import LogoutIcon from "@mui/icons-material/Logout";
import SpaceDashboardOutlinedIcon from "@mui/icons-material/SpaceDashboardOutlined";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import EditNoteOutlinedIcon from "@mui/icons-material/EditNoteOutlined";
import { Link, useLocation } from "react-router-dom";

import { signOut } from "firebase/auth";
import { auth } from "../../firebase-config";
import { toast } from "react-toastify";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { RootState } from "../store/store";

import User from "../assets/user.png";
import { clearSchool } from "../store/schoolSlice";
import { clearUser } from "../store/userSlice";

const drawerWidth = 240;

interface Props {
  isDrawerOpen: boolean;
  onDrawerToggle: () => void
}

const Sidebar: React.FC<Props> = (props) => {
  const location = useLocation();
  const dispatch = useAppDispatch();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const user = useAppSelector((state: RootState) => state.user).user;

  const handleDrawerToggle = () => {
    props.onDrawerToggle();
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      dispatch(clearSchool());
      dispatch(clearUser());
    } catch (e) {
      toast.error("Somethong went wrong!");
    }
  };

  useEffect(() => {
    setMobileOpen(props.isDrawerOpen);
  }, [props]);

  const drawer = (
    <div>
      <Toolbar
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 1,
          justifyContent: "center",
          paddingY: "10px",
          // background: "blue",
        }}
      >
        <Avatar
          alt={user?.name}
          src={user?.imgUrl ? user?.imgUrl : User}
          sx={{ width: 80, height: 80 }}
        />
        <div>{user?.name}</div>
      </Toolbar>
      <Divider />
      <List>
        <Link to="/">
          <ListItem disablePadding >
            <ListItemButton selected={location.pathname == "/"} >
              <ListItemIcon>
                <SpaceDashboardOutlinedIcon />
              </ListItemIcon>
              <ListItemText primary="Dashboard" />
            </ListItemButton>
          </ListItem>
        </Link>
        <Link to="/syllabus">
          <ListItem disablePadding>
            <ListItemButton selected={location.pathname == "/syllabus"}>
              <ListItemIcon>
                <EditNoteOutlinedIcon />
              </ListItemIcon>
              <ListItemText primary="Syllabus" />
            </ListItemButton>
          </ListItem>
        </Link>
      </List>
      <Link to="/account">
        <ListItem disablePadding>
          <ListItemButton selected={location.pathname == "/account"}>
            <ListItemIcon>
              <AccountCircleOutlinedIcon />
            </ListItemIcon>
            <ListItemText primary="Account" />
          </ListItemButton>
        </ListItem>
      </Link>
      <Divider />
      <List>
        <ListItem disablePadding>
          <ListItemButton onClick={handleLogout}>
            <ListItemIcon>
              <LogoutIcon sx={{ color: "red" }} />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItemButton>
        </ListItem>
      </List>
    </div>
  );
  return (
    <Box
      component="nav"
      sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      aria-label="mailbox folders"
    >
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: "block", sm: "none" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: drawerWidth,
          },
        }}
      >
        {drawer}
      </Drawer>
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", sm: "block" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: drawerWidth,
          },
        }}
        open
      >
        {drawer}
      </Drawer>
    </Box>
  );
};

export default Sidebar;
