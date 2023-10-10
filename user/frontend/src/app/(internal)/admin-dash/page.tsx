"use client";

/*
 * Better FRACAS
 * Copyright (C) 2023  Peter Tanner, Insan Basrewan Better Fracas team
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import * as React from "react";
import Box from "@mui/material/Box";
import Members from "@/components/Tables/members";
import Teams from "@/components/Tables/teams";
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CheckSuperuser from "@/components/CheckSuperuser";

const Admin: React.FC = () => {
    const [expandedAccordion, setExpandedAccordion] = React.useState<string | false>('panel1');
  
    const handleAccordionChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpandedAccordion(isExpanded ? panel : false);
    };
  return (
    <Box sx={{ width: "100%", }}>
      <CheckSuperuser />
      <Typography variant="h5" gutterBottom>
        Admin
      </Typography>
      <Accordion defaultExpanded expanded={expandedAccordion === 'panel1'} onChange={handleAccordionChange('panel1')}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography variant="subtitle1" gutterBottom>Users</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Members />
        </AccordionDetails>
      </Accordion>
      <Accordion expanded={expandedAccordion === 'panel2'} onChange={handleAccordionChange('panel2')}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography variant="subtitle1" gutterBottom>Teams</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Teams />
        </AccordionDetails>
      </Accordion>
    </Box>
  );
}
export default Admin;