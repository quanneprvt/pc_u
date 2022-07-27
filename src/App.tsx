import React, { useCallback, useEffect, useRef } from "react";
import "./App.css";
import data from "./data/employee.json";
import Employee from "./classes/Employee";
import EmployeeOrgApp from "./classes/EmployeeOrgApp";
import useForceUpdate from "./hooks/useForceUpdate";

// Component
import ReactJson from "react-json-view";
import { TextField, Box, ButtonGroup, Button, IconButton } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
//Provider
import CustomThemeProvider, {
  useCustomThemeProvider,
} from "./context/CustomThemeProvider";
import { CssBaseline } from "@mui/material/";

const ceo: Employee = new Employee(data);
const App = () => {
  const employeesApp = useRef<EmployeeOrgApp>();
  const fromRef = useRef<number>();
  const toRef = useRef<number>();
  const forceUpdate = useForceUpdate();
  const theme = useTheme();
  const { toggleColorMode } = useCustomThemeProvider();

  const updateIdMove = useCallback(
    (
      event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
      action: string
    ) => {
      switch (action) {
        case "from":
          fromRef.current = parseFloat(event.target.value);
          break;
        case "to":
          toRef.current = parseFloat(event.target.value);
          break;
      }
    },
    []
  );

  const moveEmployee = useCallback(() => {
    if (fromRef.current && toRef.current) {
      employeesApp.current?.move(fromRef.current, toRef.current);
      forceUpdate();
    }
  }, [forceUpdate]);

  const undo = useCallback(() => {
    employeesApp?.current?.undo();
    forceUpdate();
  }, [forceUpdate]);

  const redo = useCallback(() => {
    employeesApp?.current?.redo();
    forceUpdate();
  }, [forceUpdate]);

  useEffect(() => {
    if (!employeesApp.current) {
      employeesApp.current = new EmployeeOrgApp(ceo);
      forceUpdate();
    }
  }, [forceUpdate]);

  if (!employeesApp.current) return null;

  return (
    <Box>
      <ReactJson src={employeesApp.current} displayDataTypes={false} />
      <Box
        sx={{
          position: "fixed",
          right: 0,
          top: 0,
        }}
      >
        <IconButton sx={{ ml: 1 }} onClick={toggleColorMode} color="inherit">
          {theme.palette.mode === "dark" ? (
            <Brightness7Icon />
          ) : (
            <Brightness4Icon />
          )}
        </IconButton>
        <Box
          sx={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <TextField
            label={"The employee id that will later become subordinate"}
            placeholder={"employee id"}
            onChange={(event) => updateIdMove(event, "from")}
            variant="filled"
            sx={{ width: 500 }}
          />
          <TextField
            label={
              "The employee id that will not become subordinate and move to higher position"
            }
            placeholder={"employee id"}
            onChange={(event) => updateIdMove(event, "to")}
            variant="filled"
          />
        </Box>
        <ButtonGroup
          variant="contained"
          aria-label="outlined primary button group"
          sx={{
            justifyContent: "center",
            width: "100%",
            boxShadow: "none",
            marginTop: 3,
          }}
        >
          <Button onClick={moveEmployee}>Move</Button>
          <Button onClick={undo}>Undo</Button>
          <Button onClick={redo}>Redo</Button>
        </ButtonGroup>
      </Box>
    </Box>
  );
};

const AppWrapper = (props: any) => {
  return (
    <CustomThemeProvider>
      <CssBaseline />
      <App {...props}></App>
    </CustomThemeProvider>
  );
};

export default AppWrapper;
