import React, { useState } from 'react';
import { Typography } from "@mui/material";
import { amber, green, orange, blue } from '@mui/material/colors';
import GradingIcon from "@mui/icons-material/Grading";
import TroubleshootIcon from "@mui/icons-material/Troubleshoot";
import BuildIcon from "@mui/icons-material/Build";
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import DoneIcon from '@mui/icons-material/Done';
import Chip from '@mui/material/Chip';

interface Props {
  status: String | undefined
  messageOnly: Boolean
}

const ReportStatusMessage: React.FC<Props> = ({ status, messageOnly }) => {
  switch (status){
    case "record":
      if (messageOnly) {
        return(
          <Typography
          variant="body2"
          style={{ fontWeight: "bold" }}
          color={orange[500]}
        >
          PENDING RECORD VALIDATION
        </Typography>
        )
      } else {
        return(
          <Chip icon={<GradingIcon />} label="Record" color="warning" size="small"/>
        )
      }
      break;
    case "analysis":
      if (messageOnly) {
        return(
          <Typography
          variant="body2"
          style={{ fontWeight: "bold" }}
          color={orange[500]}
        >
          PENDING ANALYSIS VALIDATION
        </Typography>
        )
      } else {
        return(
          <Chip icon={<TroubleshootIcon />} label="Analysis" color="warning" size="small"/>
        )
      }
      break;
    case "corrective":
      if (messageOnly) {
        return(
          <Typography
          variant="body2"
          style={{ fontWeight: "bold" }}
          color={orange[500]}
        >
          PENDING CORRECTIVE VALIDATION
        </Typography>
        )
      } else {
        return(
          <Chip icon={<BuildIcon />} label="Corrective" color="warning" size="small"/>
        )
      }
      break;
    case "monitoring":
      if (messageOnly) {
        return(
          <Typography
          variant="body2"
          style={{ fontWeight: "bold" }}
          color={blue[500]}
        >
          MONITORING CORRECTIVE ACTION
        </Typography>
        )
      } else {
        return(
          <Chip icon={<PendingActionsIcon />} label="Monitoring" color="info" size="small"/>
        )
      }
      break;
    case "resolved":
      if (messageOnly) {
        return(
          <Typography
          variant="body2"
          style={{ fontWeight: "bold" }}
          color={green[500]}
        >
          RESOLVED
        </Typography>
        )
      } else {
        return(
          <Chip icon={<DoneIcon />} label="Resolved" color="success" size="small"/>
        )
      }
      break;
    default:
      if (messageOnly) {
        return(
          <Typography
          variant="body2"
          style={{ fontWeight: "bold" }}
        >
          Unknown
        </Typography>
        )
      } else {
        return(
          <Chip label="Unknown" size="small"/>
        )
      }

  }
};

export default ReportStatusMessage;
