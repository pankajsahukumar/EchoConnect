import { useState, useEffect } from "react";
import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import MessageIcon from "@mui/icons-material/Message";
import PersonIcon from "@mui/icons-material/Person";
import NotificationsIcon from "@mui/icons-material/Notifications";
import SendIcon from "@mui/icons-material/Send";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import HttpIcon from "@mui/icons-material/Http";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import TableChartIcon from "@mui/icons-material/TableChart";
import EditAttributesIcon from "@mui/icons-material/EditAttributes";
import ChatIcon from "@mui/icons-material/Chat";
import DescriptionIcon from "@mui/icons-material/Description";
import SmartButtonIcon from "@mui/icons-material/SmartButton";
import CallSplitIcon from "@mui/icons-material/CallSplit";

const StyledSidebar = styled(Paper)(({ theme }) => ({
  width: 280,
  height: "100%",
  overflow: "auto",
  borderRight: `1px solid ${theme.palette.divider}`,
}));

const DraggableItem = styled(ListItem)(({ theme }) => ({
  cursor: "grab",
  margin: theme.spacing(1, 0),
  borderRadius: theme.shape.borderRadius,
  border: `1px solid ${theme.palette.divider}`,
  "&:hover": {
    backgroundColor: theme.palette.action.hover,
  },
}));

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`sidebar-tabpanel-${index}`}
      aria-labelledby={`sidebar-tab-${index}`}
      {...other}
      style={{ height: "calc(100% - 48px)", overflow: "auto" }}
    >
      {value === index && <Box sx={{ p: 2 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `sidebar-tab-${index}`,
    "aria-controls": `sidebar-tabpanel-${index}`,
  };
}

// Define trigger nodes with their icons
const triggerNodes = [
  {
    id: "ON_CHAT_START",
    label: "On Chat Start",
    icon: <MessageIcon />,
    blockType: "ON_CHAT_START",
  },
  {
    id: "LEAD_FROM_CTWA",
    label: "Lead From CTWA",
    icon: <PersonIcon />,
    blockType: "LEAD_FROM_CTWA_V2",
  },
  {
    id: "ON_ABANDONED_CART_WOOCOMMERCE",
    label: "On Abandoned Cart",
    icon: <ShoppingCartIcon />,
    blockType: "ON_ABANDONED_CART_WOOCOMMERCE",
  },
  {
    id: "ON_AGENT_ASSIGN",
    label: "On Agent Assign",
    icon: <PersonIcon />,
    blockType: "ON_AGENT_ASSIGN",
  },
  {
    id: "ON_ATTRIBUTE_CHANGED",
    label: "On Attribute Changed",
    icon: <EditAttributesIcon />,
    blockType: "ON_ATTRIBUTE_CHANGED",
  },
  {
    id: "ON_NEW_ROW_GOOGLE_SHEET",
    label: "On New Row Google Sheet",
    icon: <TableChartIcon />,
    blockType: "ON_NEW_ROW_GOOGLE_SHEET",
  },
];

const actionNodes = [
  {
    blockId: "522f186d-899c-4286-8552-8dd05fe7612d",
    blockName: "Add / Remove Tags",
    blockDescription: null,
    needsProcessing: false,
    blockDataType: "action",
    blockType: "UPDATE_TAG",
    blockIsEmpty: false,
    restrictedTo: null,
    isVisible: true,
    disableIntegration: true,
    components: [
      {
        componentId: "e1276a3f-e45e-454e-bcaf-43e83a4dc21c",
        componentName: "Update Tags",
        componentIsMultiple: false,
        componentPosition: 0,
        componentType: "UPDATE_TAG",
        componentVariables: null,
        componentVariablesV2: null,
        elements: [
          {
            elementId: "a771b7d8-6d67-4160-a992-b9851e39a1a2",
            elementIsMandatory: true,
            elementName: "Choose action",
            elementPosition: 0,
            elementRules: {
              align: "horizontal",
              label: "Choose action",
              options: [
                {
                  label: "Add Tags",
                  value: "SET_TAG",
                },
                {
                  label: "Remove Tags",
                  value: "REMOVE_TAG",
                },
              ],
              is_radio: true,
            },
            elementType: "CHECKBOX",
            hasChildren: false,
          },
          {
            elementId: "c9d8cf7b-1781-461e-8bb5-8da3d6a56b8d",
            elementIsMandatory: true,
            elementName: "Choose Tags",
            elementPosition: 1,
            elementRules: {
              label: "Choose tags",
              api_url:
                "https://flow-api.doubletick.io/v1/component-api/96f06110-3369-4d80-8762-c68d8ec18073/f83ce0a3-5835-4707-9c42-4182dd7dd988/process",
              api_method: "POST",
              placeholder: "Select tag",
              target_element: "37321ccb-a769-42c4-bc8e-e1e56eeba21e",
              target_hierarchy: "0::0",
              disable_render_input: true,
            },
            elementType: "DROPDOWN_VARIABLE_INPUT",
            hasChildren: false,
          },
        ],
      },
    ],
  },
  {
    id: "ADD_TO_BROADCAST_LISTS",
    label: "Add to Broadcast Lists",
    icon: <NotificationsIcon />,
    blockType: "ADD_TO_BROADCAST_LIST",
  },
  {
    id: "ASSIGN_AGENT",
    label: "Assign Agent",
    icon: <PersonIcon />,
    blockType: "ASSIGN_AGENT_V3",
  },
  {
    id: "SEND_MESSAGE",
    label: "Send Message",
    icon: <ChatIcon />,
    blockType: "SEND_MESSAGE",
  },
  {
    id: "SEND_INTERACTIVE_MESSAGE",
    label: "Send Interactive Message",
    icon: <SendIcon />,
    nodeId: "b67f49f0-edcf-482f-bc55-1b95d276a762",
    blockId: "f606c23f-eb47-48ce-be62-505f51188902",
    blockDataType: "action",
    blockType: "SEND_INTERACTIVE_LIST_MESSAGE",
    blockName: "Send Interactive List Message",
    blockDescription: null,
    isStartNode: false,
    position: {
      x: 976.119822070089,
      y: 1821.309369455534,
    },
    dimension: null,
    blockIsEmpty: false,
    integrationIds: ["826ca2d7-5fe9-4415-ad6e-cbb78169c585"],
    disableIntegration: false,
    components: [
      {
        componentId: "7a69acf2-883a-4758-bcdb-97ffe3cb381b",
        componentName: "Send interactive list message",
        componentIsMultiple: false,
        componentPosition: 0,
        componentType: "INTERACTIVE_LIST_MESSSAGE",
        componentVariables: {
          status: "SENT",
          recipient: "919716858355",
        },
        componentVariablesV2: [
          {
            id: 0,
            key: "status",
            value: "SENT",
          },
          {
            id: 1,
            key: "recipient",
            value: "919716858355",
          },
        ],
        elements: [
          {
            elementId: "f7322659-dafd-4f39-83a1-7df966469f3d",
            elementIsMandatory: false,
            elementName: "Header",
            elementPosition: 0,
            elementRules: {
              label: "Header",
              max_length: 60,
              placeholder: "Add header",
              is_connector: false,
              show_variables: true,
              show_character_limit: true,
              disable_formatting_chars: true,
            },
            elementType: "CLEARABLE_INPUT",
            hasChildren: false,
            value: "",
            uniqueId: "1eb8a7de-253f-4364-8bcb-2007ea56f918",
            hasTargetBlock: false,
            rules: {},
          },
          {
            elementId: "673c7e26-3dc1-4320-a46b-fcdace183ac5",
            elementIsMandatory: true,
            elementName: "Body",
            elementPosition: 1,
            elementRules: {
              label: "Body",
              max_length: 1024,
              placeholder: "Type a message",
              is_connector: false,
              show_variables: true,
              show_character_limit: true,
            },
            elementType: "TEXTAREA",
            hasChildren: false,
            value: "Sure ! Please select what you need help with",
            uniqueId: "5d72bf37-13cf-4389-9955-37568ce033f6",
            hasTargetBlock: false,
            rules: {},
          },
          {
            elementId: "a923d10a-94f9-4318-a04d-3e57ccefbf4d",
            elementIsMandatory: false,
            elementName: "Footer",
            elementPosition: 2,
            elementRules: {
              label: "Footer",
              max_length: 20,
              placeholder: "Add footer",
              is_connector: false,
              show_variables: true,
              show_character_limit: true,
            },
            elementType: "CLEARABLE_INPUT",
            hasChildren: false,
            value: "",
            uniqueId: "3817a45b-ea5e-4886-af8c-06ce35a670f3",
            hasTargetBlock: false,
            rules: {},
          },
          {
            elementId: "e0265bf3-639e-43ef-afee-a499e9ea322d",
            elementIsMandatory: false,
            elementName: "Interactive list",
            elementPosition: 3,
            elementRules: {
              max_items: 10,
              is_connector: false,
              max_sections: 10,
              sample_value: {
                type: "list",
                button: "button",
                sections: [
                  {
                    rows: [
                      {
                        id: "string",
                        title: "string",
                        description: "string",
                      },
                    ],
                    title: "title",
                  },
                ],
              },
              show_variables: true,
            },
            elementType: "INTERACTIVE_LIST",
            hasChildren: false,
            value: {
              sections: [
                {
                  title: "",
                  rows: [
                    {
                      title: "Corporate Enquiry",
                      description: "Office events, employee gifting, etc.",
                      id: "f755f05f-25f5-43a5-9480-2767ba07d48e",
                    },
                    {
                      title: "Decorator Registration",
                      description: "Join us as a decor service partner",
                      id: "4256178b-49c8-4b18-a773-8e57753c50e4",
                    },
                    {
                      title: "Hotel Registration",
                      description: "Join us as a fnb service partner",
                      id: "f2281150-2d57-413e-a211-d28a15ab65b4",
                    },
                    {
                      title: "Others",
                      description: "Anything else",
                      id: "ad0855f9-c282-4bdc-970a-7be81b6170b3",
                    },
                  ],
                  id: "55c12f5d-8fba-44f3-9f40-c0af15c5214b",
                },
              ],
              button: "Choose your option",
            },
            uniqueId: "914b82b8-636a-4ce9-9b33-1569a5494dcf",
            hasTargetBlock: false,
            rules: {
              sample_value: {
                type: "list",
                button: "button",
                sections: [
                  {
                    rows: [
                      {
                        id: "string",
                        title: "string",
                        description: "string",
                      },
                    ],
                    title: "title",
                  },
                ],
              },
            },
          },
          {
            elementId: "0cfcedd6-a24d-4b28-9669-a0d9ccef35b8",
            elementIsMandatory: false,
            elementName: "Sample Connection",
            elementPosition: 4,
            elementRules: {
              disable_render: true,
            },
            elementType: "BUTTON_REPEAT",
            hasChildren: false,
            value: "f755f05f-25f5-43a5-9480-2767ba07d48e",
            uniqueId: "f755f05f-25f5-43a5-9480-2767ba07d48e",
            hasTargetBlock: true,
            rules: null,
          },
          {
            elementId: "0cfcedd6-a24d-4b28-9669-a0d9ccef35b8",
            elementIsMandatory: false,
            elementName: "Sample Connection",
            elementPosition: 5,
            elementRules: {
              disable_render: true,
            },
            elementType: "BUTTON_REPEAT",
            hasChildren: false,
            value: "4256178b-49c8-4b18-a773-8e57753c50e4",
            uniqueId: "4256178b-49c8-4b18-a773-8e57753c50e4",
            hasTargetBlock: true,
            rules: null,
          },
          {
            elementId: "0cfcedd6-a24d-4b28-9669-a0d9ccef35b8",
            elementIsMandatory: false,
            elementName: "Sample Connection",
            elementPosition: 6,
            elementRules: {
              disable_render: true,
            },
            elementType: "BUTTON_REPEAT",
            hasChildren: false,
            value: "f2281150-2d57-413e-a211-d28a15ab65b4",
            uniqueId: "f2281150-2d57-413e-a211-d28a15ab65b4",
            hasTargetBlock: true,
            rules: null,
          },
          {
            elementId: "0cfcedd6-a24d-4b28-9669-a0d9ccef35b8",
            elementIsMandatory: false,
            elementName: "Sample Connection",
            elementPosition: 7,
            elementRules: {
              disable_render: true,
            },
            elementType: "BUTTON_REPEAT",
            hasChildren: false,
            value: "ad0855f9-c282-4bdc-970a-7be81b6170b3",
            uniqueId: "ad0855f9-c282-4bdc-970a-7be81b6170b3",
            hasTargetBlock: true,
            rules: null,
          },
        ],
      },
    ],
  },
  {
    id: "SLEEP_DELAY",
    label: "Sleep / Delay",
    icon: <HourglassEmptyIcon />,
    blockType: "SLEEP_DELAY",
    blockName: "Sleep / Delay",
  },
  {
    id: "HTTP_API_CALL",
    label: "HTTP API Call",
    icon: <HttpIcon />,
    blockType: "HTTP_API_CALL",
    blockName: "HTTP API Call",
  },
  {
    id: "SEND_TEMPLATE_MESSAGE",
    label: "Send Template Message",
    icon: <DescriptionIcon />,
    blockType: "SEND_TEMPLATE_MESSAGE",
    blockName: "Send Template Message",
  },
  {
    id: "SEND_BUTTON_MESSAGE",
    label: "Send Button Message",
    icon: <SmartButtonIcon />,
    blockType: "SEND_BUTTON_MESSAGE",
    blockName: "Send Button Message",
  },
  {
    id: "UPDATE_ATTRIBUTE",
    label: "Update Attribute",
    icon: <EditAttributesIcon />,
    blockType: "UPDATE_ATTRIBUTE",
    blockName: "Update Attribute",
  },
  {
    id: "CONDITION",
    label: "Condition / Branch",
    icon: <CallSplitIcon />,
    blockType: "condition",
    blockName: "Condition",
    components: [
      {
        componentId: "condition-comp-1",
        componentName: "Condition Settings",
        componentIsMultiple: false,
        componentPosition: 0,
        componentType: "CONDITION",
        elements: [
          {
            elementId: "cond-variable",
            elementIsMandatory: true,
            elementName: "Variable",
            elementPosition: 0,
            elementRules: {
              label: "Variable to check",
              placeholder: "e.g. {{name}}",
            },
            elementType: "CLEARABLE_INPUT",
            hasChildren: false,
          },
          {
            elementId: "cond-operator",
            elementIsMandatory: true,
            elementName: "Operator",
            elementPosition: 1,
            elementRules: {
              label: "Operator",
              align: "horizontal",
              is_radio: true,
              options: [
                { label: "Equals", value: "EQUALS" },
                { label: "Not Equals", value: "NOT_EQUALS" },
                { label: "Contains", value: "CONTAINS" },
                { label: "Is Empty", value: "IS_EMPTY" },
              ],
            },
            elementType: "CHECKBOX",
            hasChildren: false,
          },
          {
            elementId: "cond-value",
            elementIsMandatory: false,
            elementName: "Value",
            elementPosition: 2,
            elementRules: {
              label: "Compare value",
              placeholder: "Enter value to compare",
            },
            elementType: "CLEARABLE_INPUT",
            hasChildren: false,
          },
        ],
      },
    ],
  },
];

export default function FlowSidebar({ onDragStart }) {
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const onDragStartHandler = (event, nodeType, nodeData) => {
    console.log("Dragging node:", nodeType, nodeData);
    // Include the blockType in the data being transferred
    event.dataTransfer.setData(
      "application/reactflow",
      JSON.stringify({
        type: nodeType,
        data: {
          ...nodeData,
          blockType: nodeData.blockType, // Ensure blockType is included
        },
      })
    );
    event.dataTransfer.effectAllowed = "move";

    if (onDragStart) {
      onDragStart(event);
    }
  };

  return (
    <StyledSidebar elevation={0}>
      <Tabs
        value={value}
        onChange={handleChange}
        aria-label="flow sidebar tabs"
        variant="fullWidth"
      >
        <Tab label="Triggers" {...a11yProps(0)} />
        <Tab label="Actions" {...a11yProps(1)} />
      </Tabs>

      <TabPanel value={value} index={0}>
        <Typography variant="subtitle2" gutterBottom>
          Drag a trigger to start your flow (only one allowed)
        </Typography>
        <List>
          {triggerNodes.map((node) => (
            <DraggableItem
              key={node.id}
              draggable
              onDragStart={(event) =>
                onDragStartHandler(event, "trigger", node)
              }
            >
              <ListItemIcon>{node.icon}</ListItemIcon>
              <ListItemText primary={node.label} />
            </DraggableItem>
          ))}
        </List>
      </TabPanel>

      <TabPanel value={value} index={1}>
        <Typography variant="subtitle2" gutterBottom>
          Drag actions to build your flow
        </Typography>
        <List>
          {actionNodes.map((node) => (
            <DraggableItem
              key={node.id}
              draggable
              onDragStart={(event) => onDragStartHandler(event, "action", node)}
            >
              <ListItemIcon>{node.icon}</ListItemIcon>
              <ListItemText primary={node.blockName || node.label} />
            </DraggableItem>
          ))}
        </List>
      </TabPanel>
    </StyledSidebar>
  );
}
