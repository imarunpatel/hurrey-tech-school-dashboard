import { AppBar, IconButton, Toolbar, Typography } from "@mui/material";
import React from "react";
import MenuIcon from "@mui/icons-material/Menu";
import Logo from "../assets/logo.png";

interface Props {
  handleDrawerOpen: () => void;
  window?: () => Window;
}
const drawerWidth = 240;
const Header: React.FC<Props> = (props) => {

  return (
    <AppBar
      position="fixed"
      sx={{
        width: { sm: `calc(100% - ${drawerWidth}px)` },
        ml: { sm: `${drawerWidth}px` },
      }}
    >
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={props.handleDrawerOpen}
          sx={{ mr: 2, display: { sm: "none" } }}
        >
          <MenuIcon />
        </IconButton>
        <img src={Logo} alt="" width={60} />
        <Typography variant="h6" noWrap component="div" ml={1}>
          School Dashboard
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
