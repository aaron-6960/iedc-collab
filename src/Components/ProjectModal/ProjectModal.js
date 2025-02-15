import React, { useContext, useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { Formik } from "formik";
import * as yup from "yup";
import { Form, Row, Col, InputGroup } from "react-bootstrap";
import {
  addSkills,
  doCreateProject,
  doEditProject,
  getSkills,
  getTags,
  addTags,
  sendInvite,
  getProjects,
} from "../../Firebase/firebase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpload, faTrash } from "@fortawesome/free-solid-svg-icons";
import "./ProjectModal.scss";
import { ProjectContext } from "../../contexts/ProjectContext";
import { toast } from "react-toastify";
import Compress from "compress.js";
import {
  Autocomplete,
  createTheme,
  FormControlLabel,
  Radio,
  RadioGroup,
  TextField,
  ThemeProvider,
} from "@mui/material";
import { AuthContext } from "../../Firebase/Auth/Auth";

//image size
import { getImageSize } from "react-image-size";

const compress = new Compress();
const NewProjectForm = ({ onClose, project, setVariable, variable }) => {
  const [image, setImage] = useState(project?.projectPhoto || "");
  const [dimensions, setDimensions] = useState();
  const [imageWidth, setImageWidth] = useState(0);
  const [isReq, setIsReq] = useState(project?.isReq || true);
  const [skills, setSkills] = useState([]);
  const [tags, setTags] = useState([]);
  const [skill, setSkill] = useState("");
  const [tag, setTag] = useState("");
  const [acValue1, setACValue1] = useState(project?.skills || []);
  const [acValue2, setACValue2] = useState(project?.tags || []);
  const [remainSkills, setRemainSkills] = useState([]);
  const [remainTags, setRemainTags] = useState([]);
  const [formErrors,setFormErrors] = useState({});
  const [formTouched,setFormTouched] = useState({});
  const [descriptionPhotos, setDescriptionPhotos] = useState([])

  const { currentUser } = useContext(AuthContext);
  const [projectPhotoName, setProjectPhotoName] = useState(
    project?.projectPhotoName || ""
  );
  const [projectPhoto, setProjectPhoto] = useState(
    project?.projectPhoto || null
  );
  const {
    fetchData,
    fetchRequests,
    projects,
    developers,
    devHash,
  } = useContext(ProjectContext);
  const initialValue = {
    name: project?.name || "",
    desc: project?.desc || "",
    req: project?.req || "",
    isReq: project?.isReq || true,
    skills: project?.skills || "",
    links: project?.links?.join(", ") || "",
    contactNo: project?.contactNo || "",
    githubLink: project?.githubLink || "",
    tags: project?.tags || "",
    teamMembers: project?.teamMembers ? project.teamMembers.join(", ") : "",
    hiring: project?.hiring ? project.hiring.join(", ") : "",
    projectPhoto: project?.projectPhoto,
  };

  useEffect(() => {
    if(formErrors) {
      Object.keys(formTouched).map((key) => {
        toast(formErrors[key],{
          autoClose: 1500,
        })
      })
    }
  },[formErrors])

  function getRemainSkills() {
    // let temp1 = [];
    // skills?.forEach((skill) => {
    //   if (!acValue1.find((item) => item === skill)) temp1.push(skill);
    // });
    // console.log(skills);
    setRemainSkills(skills);
    //// console.log(acValue)

    //// console.log(temp)
  }

  function getRemainTags() {
    // let temp1 = [];
    // tags?.forEach((tag) => {
    //   if (!acValue2.find((item) => item === tag)) temp1.push(tag);
    // });
    setRemainTags(tags);
    //// console.log(acValue)

    //// console.log(temp)
  }

  const getAbilities = async () => {
    await getSkills().then(async (snapshot) => {
      setSkills(Object.values(snapshot.data()));
    });
  };
  const getTagDetails = async () => {
    await getTags().then(async (snapshot) => {
      setTags(Object.values(snapshot.data()));
    });
  };

  useEffect(() => {
    getTagDetails();
  }, []);
  useEffect(() => {
    getAbilities();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [skill, acValue1]);

  useEffect(() => {
    getTagDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tag, acValue2]);

  useEffect(() => {
    getRemainSkills();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [skills, acValue1]);

  useEffect(() => {
    getRemainTags();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tags, acValue2]);

  const sendEmailsToTeamMembers = async (teamMembersArray, name) => {
    console.log(projects);
    const project = projects.filter(
      (project) =>
        project.name === name && project.leaderEmail === currentUser.email
    );
    console.log(project);
    for (const member of teamMembersArray) {
      if (
        member !== currentUser.email &&
        !project[0].teamMembers.includes(member)
      ) {
        console.log(member, devHash[member]);
        const data = {
          sender: currentUser.displayName,
          sender_id: currentUser.uid,
          sender_email: currentUser.email,
          sender_img: currentUser.photoURL,
          receiver_email: member,
          receiver: devHash[member]?.name || "",
          receiver_img:
            "https://sabt.center/wp-content/uploads/2014/08/avatar-1.png",
          receiver_id: devHash[member]?.id || "",
          project_id: project[0].id,
          project: project[0].name,
          message: "You are invited to this project!!",
          status: "pending",
          createdAt: Date.now(),
        };
        console.log(data);
        await sendInvite(data).then(() => {
          fetchRequests();
        });
      }
    }
  };
  const theme = createTheme({
    components: {
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            "&:hover .MuiOutlinedInput-notchedOutline": {
              color: "#9E0000",
              border: "2px solid #9E0000",
              outline: "none",
              borderRadius: "10px",
            },
            "& .MuiOutlinedInput-notchedOutline": {
              color: "#9E0000",
              border: "2px solid #9E0000",
              outline: "none",
              borderRadius: "10px",
            },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              color: "#9E0000",
              border: "2px solid #9E0000",
              outline: "none",
              borderRadius: "10px",
            },
            "& .MuiChip-root": {
              fontFamily: "Nunito",
              backgroundColor: "#9E0000",
              color: "white",
            },
            "& .MuiChip-deleteIcon": { color: "#fff !important" },
            minHeight: "150%",
          },
        },
      },
    },
  });
  const newProjectSchema = yup.object({
    name: yup.string().required("Please add a valid project name").min(3),
    desc: yup.string().required("Please add a valid description").min(10),
    contactNo: yup
      .string()
      .required()
      .matches(
        /^[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/,
        "Please enter a valid 10 digit phone number"
      ),
    links: yup.string().min(4),
    githubLink: yup.string().optional().min(4),
    teamMembers: yup.string().optional().matches(
      /^\b[A-Za-z0-9.%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b(?:,\s*\b[A-Za-z0-9.%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b)*$/,
      "Please enter a valid email"
    )
  });

  const handleSubmit = (values, actions) => {
    const { links, teamMembers: teamMembersString, hiring } = values;

    const teamMembersArray = teamMembersString
      .split(",")
      .filter((value) => value !== currentUser.email)
      .map((email) => email.trim());
    const confirmedMembers = initialValue.teamMembers
      .split(",")
      .filter((value) => value !== currentUser.email)
      .map((email) => email.trim());
    console.log(initialValue)
    const formValues = {
      ...values,
      skills: acValue1,
      tags: acValue2,
      links: links
        .split(",")
        .filter(Boolean)
        .map((link) => link.trim()),
      teamMembers: confirmedMembers.length > teamMembersArray.length ? teamMembersArray : confirmedMembers,
      hiring: hiring
        .split(",")
        .filter(Boolean)
        .map((link) => link.trim()),
      projectPhoto,
      projectPhotoName,
    };
    if (!formValues.teamMembers.includes(currentUser?.email)) {
      formValues.teamMembers.push(currentUser?.email);
    }
    formValues.teamMembers = formValues.teamMembers.filter(
      (item, index) => formValues.teamMembers.indexOf(item) === index
    );
    console.log(formValues.teamMembers, teamMembersArray);
    if (!project) {
      doCreateProject(formValues, developers, () => {
        fetchData();
      })
        .then(() => {
          sendEmailsToTeamMembers(teamMembersArray, formValues.name);
        })
        .then((res) => {
          toast("Project created and Email Requests send", {
            autoClose: 3000,
          });
        });
    } else {
      doEditProject(formValues, project.id, developers, () => {
        fetchData();
        setVariable(!variable);
        toast("Project edited successfully", {
          autoClose: 3000,
        });
      }).then(() => {
        sendEmailsToTeamMembers(teamMembersArray, formValues.name);
      });
    }
    onClose();
    actions.resetForm();
  };

  //Function to fetch image dimension details
  async function fetchImageSize(url) {
    try {
      const dimensions = await getImageSize(url);
      return dimensions;
    } catch (error) {
      console.error(error);
    }
  }

  const removeDuplicates=(skillsSnapshot,inputSkills)=> {
       
    const skillsObject = skillsSnapshot.data() || {};
    let skillsArray = Object.values(skillsObject); 
    inputSkills.forEach((skill) => {      
      skillsArray.push(skill);
    });  
    skillsArray = Array.from(new Set(skillsArray.map(skill => skill.toLowerCase()))); 
    const skillsObjectForFirestore = {};
    skillsArray.forEach((skill, index) => {
      skillsObjectForFirestore[`${index}`] = skill.toLowerCase();
    });
    return skillsObjectForFirestore;
  }

  return (
    <div className="newProjectForm">
      <Formik
        initialValues={initialValue}
        validationSchema={newProjectSchema}
        onSubmit={handleSubmit}
        validateOnChange={false}
      >
        {(props) => {
          if (props.errors) {
            setFormErrors(props.errors);
            setFormTouched(props.touched);
          }
          
          return(
          <Form>
            <Form.Group controlId="formBasicTitle">
              <Form.Label>Project Name*</Form.Label>
              <Form.Control
                required
                onBlur={props.handleBlur("name")}
                value={props.values.name}
                onChange={props.handleChange("name")}
                type="text"
                placeholder="Enter Project Title"
              />
              <Form.Text className="text-danger">
                {props.touched.name && props.errors.name}
              </Form.Text>
            </Form.Group>

            <Form.Group controlId="formBasicDescription">
              <Form.Label>Project Description*</Form.Label>
              <Form.Control
                onBlur={props.handleBlur("desc")}
                value={props.values.desc}
                onChange={props.handleChange("desc")}
                as="textarea"
                style={{ whiteSpace: "pre-wrap" }}
                placeholder="lorem ipsum dolor si amet..."
                rows="3"
              />
              <Form.Text className="text-danger">
                {props.touched.desc && props.errors.desc
                  ? "Please enter a description greater than 10 characters"
                  : ""}
              </Form.Text>
            </Form.Group>
            <Form.Group
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                flexWrap: "wrap",
              }}
            >
              <Form.Label>Are you looking for team members?</Form.Label>
              <RadioGroup
                row
                aria-labelledby="demo-row-radio-buttons-group-label"
                name="row-radio-buttons-group"
                style={{
                  marginTop: "10px",
                  marginLeft: "10px",
                }}
                value={isReq}
                onChange={() => {
                  setIsReq(!isReq);
                }}
              >
                <FormControlLabel
                  value={true}
                  control={<Radio />}
                  label="Yes"
                />
                <FormControlLabel
                  value={false}
                  control={<Radio />}
                  label="No"
                />
              </RadioGroup>
            </Form.Group>
            {isReq ? (
              <>
                <Form.Group controlId="formBasicDescription">
                  <Form.Label>Project Requirements</Form.Label>
                  <Form.Control
                    onBlur={props.handleBlur("req")}
                    value={props.values.req}
                    style={{ whiteSpace: "pre-wrap" }}
                    onChange={props.handleChange("req")}
                    as="textarea"
                    placeholder="lorem ipsum dolor si amet..."
                    rows="3"
                  />
                  <Form.Text className="text-danger">
                    {props.touched.req && props.errors.req ? "" : ""}
                  </Form.Text>
                </Form.Group>
                <Form.Group controlId="formTeamMembers">
                  <Form.Label>Hiring Roles</Form.Label>
                  <Form.Control
                    onBlur={props.handleBlur("hiring")}
                    value={props.values.hiring}
                    onChange={props.handleChange("hiring")}
                    type="text"
                    placeholder="Enter Hiring Roles..."
                  />
                  <Form.Text className="text-right helperText">
                    Please separate the roles using commas
                  </Form.Text>
                </Form.Group>
                <br />
              </>
            ) : null}

            <InputGroup controlId="formPhoto" className="photoContainer">
              <Form.Label className="photoLabel">
                <span className="photoHead" style={{ fontWeight: "800" }}>
                  Upload Featuring Photo
                </span>
                <span className="photoIcon">
                  <FontAwesomeIcon icon={faUpload} />
                </span>

                <Form.Control
                  required
                  onBlur={props.handleBlur("photo")}
                  onChange={async (e) => {
                    if (e.target.files[0].size > 1048576) {
                      toast("File size should be less than 1MB", {
                        autoClose: 2000,
                      });
                    } else {
                      try {
                        const results = await compress.compress(
                          [...e.target.files],
                          {
                            size: 1.5,
                            quality: 0.7,
                            rotate: false,
                            resize: true,
                          }
                        );
                        const img1 = results[0];
                        const base64str = results[0].data;
                        const imgExt = img1.ext;
                        const compressedImage = Compress.convertBase64ToFile(
                          base64str,
                          imgExt
                        );
                        setProjectPhoto(compressedImage);
                        setProjectPhotoName(e.target.files[0].name);
                        setImage(URL.createObjectURL(compressedImage));
                        const dimensions = await fetchImageSize(
                          URL.createObjectURL(compressedImage)
                        );
                        setDimensions(dimensions);
                        // console.log(dimensions);
                        const width =
                          (dimensions.width / dimensions.height) * 200;
                        setImageWidth(width);
                      } catch (error) {
                        setProjectPhoto(e.target.files[0]);
                        setProjectPhotoName(e.target.files[0].name);
                        setImage(URL.createObjectURL(e.target.files[0]));
                        // console.log("Error in compressing: " + error);
                      }
                    }
                  }}
                  type="file"
                  className="customFile"
                />
                {/* </span> */}
              </Form.Label>
            </InputGroup>
            <Form.Text className="text-danger">
              {props.touched.photo && props.errors.photo}
            </Form.Text>
            <Row className="col-md-12 d-flex justify-content-center">
              {image && (
                <img
                  className="projectPhoto"
                  alt="project banner"
                  width={dimensions ? imageWidth : 200}
                  height="200px"
                  src={image}
                ></img>
              )}
            </Row>

            <br />
            <InputGroup controlId="formPhotoDescription" className="photoContainer">
              <Form.Label className="photoLabel">
                <span className="photoHead" style={{ fontWeight: "800" }}>
                  Upload Description Photos
                </span>
                <span className="photoIcon">
                  <FontAwesomeIcon icon={faUpload} />
                </span>

                <Form.Control
                  required
                  onBlur={props.handleBlur("photo")}
                  onChange={async (e) => {
                    let files = e.target.files;
                    if (files.length + descriptionPhotos.length > 4) {
                      toast('You can only upload up to 4 images', {
                        autoClose:2000
                      });
                    } else {
                      console.log(files)
                      if (files[0].size > 1048576) {
                        toast("File size should be less than 1MB", {
                          autoClose: 2000,
                        });
                      } else {
                        try {
                          const results = await compress.compress(
                            [...e.target.files],
                            {
                              size: 1.5,
                              quality: 0.7,
                              rotate: false,
                              resize: true,
                            }
                          );
                          const img1 = results[0];
                          const base64str = results[0].data;
                          const imgExt = img1.ext;
                          const compressedImage = Compress.convertBase64ToFile(
                            base64str,
                            imgExt
                          );
                          const imageURL = URL.createObjectURL(compressedImage);
                          // setProjectPhoto(compressedImage);
                          // setProjectPhotoName(e.target.files[0].name);
                          // setImage(URL.createObjectURL(compressedImage));
                          const dimensions = await fetchImageSize(imageURL);
                          // console.log(dimensions);
                          const width =
                            (dimensions.width / dimensions.height) * 200;
                          setDescriptionPhotos([...descriptionPhotos, {imageURL,dimensions,width}]);
                        } catch (error) {
                          // setProjectPhoto(e.target.files[0]);
                          // setProjectPhotoName(e.target.files[0].name);
                          // setImage(URL.createObjectURL(e.target.files[0]));
                          // console.log("Error in compressing: " + error);
                          setDescriptionPhotos([...descriptionPhotos, URL.createObjectURL(e.target.files[0])]);
                        }
                      }
                    }}}
                  type="file"
                  className="customFile"
                />
                {/* </span> */}
              </Form.Label>
            </InputGroup>
            <Form.Text  className="text-right helperText">
              {descriptionPhotos.length}/4 images selected.
            </Form.Text>
            <Form.Text className="text-danger">
              {props.touched.photo && props.errors.photo}
            </Form.Text>
            {descriptionPhotos && descriptionPhotos.map((img,index) => {

                return (
                <Row className="row text-center descriptionPhoto">
                  <Col className="col-sm-10 descriptionPhoto-image">
                    <img
                      key={index}
                      alt="description photos"
                      width={img.dimensions ? img.imageWidth : 200}
                      height="200px"
                      src={img.imageURL}
                    />
                  </Col>
                  <Col className="col-sm-2 descriptionPhoto-remove">
                  <button className="descriptionPhoto-button"
                    onClick={() => {
                      setDescriptionPhotos(imgs => imgs.filter(item => item.imageURL !== img.imageURL));
                    }}
                  >
                    <FontAwesomeIcon size="2x" icon={faTrash} />
                  </button>
                  </Col>
                </Row>
                )
              })}
            <Form.Group controlId="formTeamMembers">
              <Form.Label>Team Members</Form.Label>
              <Form.Control
                onBlur={props.handleBlur("teamMembers")}
                value={props.values.teamMembers}
                onChange={props.handleChange("teamMembers")}
                type="text"
                placeholder="Enter Team members emails..."
              />
              <Form.Text className="text-right helperText">
                Please separate the emails using commas.
              </Form.Text>
              <Form.Text className="text-danger">
                {props.touched.teamMembers && props.errors.teamMembers}
              </Form.Text>
            </Form.Group>

            <Row>
              <Form.Group controlId="formContactNo" className="col-md-6">
                <Form.Label>Contact No*</Form.Label>
                <Form.Control
                  onBlur={props.handleBlur("contactNo")}
                  value={props.values.contactNo}
                  onChange={props.handleChange("contactNo")}
                  type="text"
                  placeholder="Enter your contact no"
                />
                <Form.Text className="text-danger">
                  {props.touched.contactNo && props.errors.contactNo}
                </Form.Text>
              </Form.Group>

              <Form.Group controlId="formGithubLink" className="col-md-6">
                <Form.Label>Project Github Link</Form.Label>
                <Form.Control
                  onBlur={props.handleBlur("githubLink")}
                  value={props.values.githubLink}
                  onChange={props.handleChange("githubLink")}
                  type="text"
                  placeholder="eg: https://github.com/IEDCMEC/iedc-collab-frontend/"
                />
                <Form.Text className="text-danger">
                  {props.touched.githubLink && props.errors.githubLink}
                </Form.Text>
              </Form.Group>
            </Row>
            <Form.Group controlid="formSkills">
              <ThemeProvider theme={theme}>
                <Autocomplete
                  multiple
                  onChange={(event, value) => {
                    setACValue1(value);
                  }}
                  id="checkboxes-tags-demo"
                  value={acValue1}
                  options={remainSkills}
                  filterSelectedOptions
                  renderOption={(props, option) => (
                    <li
                      style={{ fontFamily: "Nunito", color: "#9e0000" }}
                      {...props}
                    >
                      {option}
                    </li>
                  )}
                  renderInput={(params) => (
                    <TextField
                      size="small"
                      {...params}
                      label="Tech Stacks"
                      className={theme.root}
                      sx={{
                        "& .MuiInputLabel-root": {
                          color: "#9E0000",
                          fontFamily: "Nunito",
                          fontWeight: "600",
                        },
                        "& label.Mui-focused": {
                          color: "#9E0000",
                          outline: "none",
                        },
                      }}
                      variant="outlined"
                    />
                  )}
                />
              </ThemeProvider>
              <Form.Text className="text-danger">
                {props.touched.skills && props.errors.skills}
              </Form.Text>
            </Form.Group>
            <div className="add-skill-row">
              <Form.Group controlid="formContact" className="col-md-6">
                <Form.Label>
                  Enter Stack (If not present in the list)
                </Form.Label>
                <Form.Control
                  value={skill}
                  onChange={(e) => setSkill(e.target.value)}
                  type="text"
                  placeholder="Enter Stack"
                />
              </Form.Group>
              <div
                className="add-skill-btn"
                onClick={() => {
                  if (!skill) toast("Please enter a stack.");
                  else {
                    if (skill && skill.length > 0) {
                      for (let i = 0; i < skills.length; i++) {
                        if (skills[i] !== undefined) {
                          if (skills[i].toLowerCase() === skill.toLowerCase()) {
                            toast("Stack already present in list.");
                            break;
                          }
                        }
                      }
                      const newSkills = skill.split(",");    
                      const filteredSkills = newSkills
                        .map((skill) => skill.trim())
                        .filter((skill) => skill !== "");    
                      setACValue1((prevSkills) => [...prevSkills, ...filteredSkills]);
                      console.log("Filtered Skills:", filteredSkills);
                      addSkills(filteredSkills,removeDuplicates);
                      setSkill("");
                    }
                  }
                }}
              >
                Add Stack
              </div>
            </div>
            <Form.Group controlid="formTags">
              <ThemeProvider theme={theme}>
                <Autocomplete
                  multiple
                  onChange={(event, value) => {
                    setACValue2(value);
                  }}
                  id="checkboxes-tags-demo"
                  value={acValue2}
                  options={remainTags}
                  filterSelectedOptions
                  renderOption={(props, option) => (
                    <li
                      style={{ fontFamily: "Nunito", color: "#9e0000" }}
                      {...props}
                    >
                      {option}
                    </li>
                  )}
                  renderInput={(params) => (
                    <TextField
                      size="small"
                      {...params}
                      label="Tags"
                      className={theme.root}
                      sx={{
                        "& .MuiInputLabel-root": {
                          color: "#9E0000",
                          fontFamily: "Nunito",
                          fontWeight: "600",
                        },
                        "& label.Mui-focused": {
                          color: "#9E0000",
                          outline: "none",
                        },
                      }}
                      variant="outlined"
                    />
                  )}
                />
              </ThemeProvider>
              <Form.Text className="text-danger">
                {props.touched.tags && props.errors.tags}
              </Form.Text>
            </Form.Group>
            <div className="add-skill-row">
              <Form.Group controlid="formContact" className="col-md-6">
                <Form.Label>Enter Tag (If not present in the list)</Form.Label>
                <Form.Control
                  value={tag}
                  onChange={(e) => setTag(e.target.value)}
                  type="text"
                  placeholder="Enter Tag"
                />
              </Form.Group>
              <div
                className="add-skill-btn"
                onClick={() => {
                  if (!tag) toast("Please enter a tag.");
                  else {
                    if (tag && tag.length > 0) {
                      // for (let i = 0; i < tags.length; i++) {
                      //   if (tags[i].toLowerCase() === tag.toLowerCase()) {
                      //     toast("Tag already present in list.");
                      //     break;
                      //   }
                      // }
                      addTags(tag);
                      setTag("");
                      setACValue2([...acValue2, tag]);
                    }
                  }
                }}
              >
                Add Tag
              </div>
            </div>

            <Form.Group controlId="formLinks">
              <Form.Label>Add Links</Form.Label>
              <Form.Control
                onBlur={props.handleBlur("links")}
                value={props.values.links}
                onChange={props.handleChange("links")}
                type="text"
                placeholder="eg: www.example.com"
              />
              <Form.Text className="helperText text-right">
                Please separate the links using commas
              </Form.Text>
              <Form.Text className="text-danger">
                {props.touched.links && props.errors.links}
              </Form.Text>
            </Form.Group>
            <Row className="col-md-12 d-flex justify-content-center">
              <Button
                variant="outline-danger"
                className="btn"
                type="submit"
                size="sm"
                onClick={props.handleSubmit}
              >
                <strong>Submit</strong>
              </Button>
            </Row>
          </Form>
        )}}
      </Formik>
    </div>
  );
};

const ProjectModal = (props) => {
  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Body className="modalbody">
        <div className="d-flex justify-content-between align-items-center">
          <h3 className="modalHead ">Create New Project</h3>
          <i
            className="fa fa-close d-block d-md-none"
            style={{
              fontSize: "25px",
              right: "30px",
              padding: 10,
              cursor: "pointer",
            }}
            onClick={props.onHide}
          ></i>
        </div>
        <Col className="p-md-5">
          <NewProjectForm
            onClose={props.onHide}
            project={props.project}
            setVariable={props.setVariable}
            variable={props.variable}
          />
        </Col>
      </Modal.Body>
    </Modal>
  );
};
export default ProjectModal;
