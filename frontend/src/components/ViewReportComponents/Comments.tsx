import { API_CLIENT, API_TYPES, API_ENDPOINT } from "@/helpers/api";
import SendIcon from "@mui/icons-material/Send";
import {
  Button,
  Card,
  CardContent,
  Divider,
  Box,
  Grid,
  InputAdornment,
  TextField,
  Typography,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Table,
  tableCellClasses,
} from "@mui/material";
import LocalizedDate from "@/components/LocalizedDate";
import { AxiosResponse, AxiosError } from "axios";
import { useEffect, useState } from "react";

interface Props {
  id: number;
}

const Comments = ({ id }: Props) => {
  const [inputComment, setInputValue] = useState<string>("");
  const [comments, setComments] = useState<
    API_TYPES.REPORT.COMMENTS.GET.RESPONSE[]
  >([]);

  const fetchData = async () => {
    try {
      await API_CLIENT.get<
        API_TYPES.NULLREQUEST_,
        AxiosResponse<API_TYPES.REPORT.COMMENTS.GET.RESPONSE[]>
      >(`${API_ENDPOINT.RECORD}/${id}/comments`)
        .then((response) => {
          setComments(response.data);
        })
        .catch((error: AxiosError<API_TYPES.USER.RESPONSE>) => {});
    } catch (error) {}
  };

  // Runs fetchData() when page is initally loaded
  useEffect(() => {
    fetchData();
  }, []);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const submitComment = () => {
    if (inputComment.trim() !== "") {
      (async () => {
        try {
          await API_CLIENT.post<
            API_TYPES.REPORT.COMMENTS.POST.REQUEST,
            AxiosResponse<API_TYPES.REPORT.COMMENTS.POST.REQUEST>
          >(`${API_ENDPOINT.RECORD}/${id}/comments`, { comment: inputComment })
            .then((response) => {
              fetchData();
            })
            .catch((error: AxiosError<API_TYPES.USER.RESPONSE>) => {});
        } catch (error) {}
      })();
      setInputValue("");
    }
  };

  const submitEnterShortcut = (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === "Enter") {
      event.preventDefault();
      submitComment();
    }
  };

  return (
    <>
      <Typography
        variant="body1"
        className="sectionTitle"
        style={{ fontWeight: "bold" }}
      >
        Comments:
      </Typography>
      <TextField
        label="Add a comment"
        variant="outlined"
        value={inputComment}
        onChange={handleInputChange}
        onKeyDown={submitEnterShortcut}
        fullWidth
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <Button
                className="editButton"
                size="small"
                onClick={submitComment}
              >
                <SendIcon className="commentIcon" color={"primary"} />
              </Button>
            </InputAdornment>
          ),
        }}
        sx={{ marginTop: "20px", marginBottom: "20px", displayPrint: "none" }}
      />
      <Grid container spacing={1}>
        {comments.length > 0 ? (
          <Table
            sx={{
              [`& .${tableCellClasses.root}`]: {
                borderBottom: "none",
              },
            }}
          >
            <TableBody>
              {comments.map((item) => (
                <TableRow>
                  <TableCell
                    sx={{ width: "1%", whiteSpace: "nowrap", maxWidth: "5%" }}
                  >
                    <LocalizedDate date_string={item.created_at} />
                  </TableCell>
                  <TableCell
                    sx={{ width: "1%", whiteSpace: "nowrap", maxWidth: "5%" }}
                  >
                    {`${item.user.name} (${
                      item.user.team ? item.user.team.name : "?"
                    }):`}
                  </TableCell>
                  <TableCell>{item.text}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <Typography
            sx={{
              fontStyle: "italic",
              textAlign: "center",
              width: "100%",
              margin: "20px",
            }}
          >
            There are no comments yet!
          </Typography>
        )}
        <Typography variant="body2"></Typography>
      </Grid>
    </>
  );
};

export default Comments;
