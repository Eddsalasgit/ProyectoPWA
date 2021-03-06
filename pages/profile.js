import {
    Avatar,
    Box,
    Button,
    Flex,
    FormControl,
    FormLabel,
    Input,
    Stack,
  } from "@chakra-ui/react";
  import { useEffect, useState } from "react";
  import Navbar from "../components/Navbar";
  import { supabaseClient } from "../lib/supabaseClient";
  import { useRouter } from "next/router";
  import en from "../translations/en.json"
  import es from "../translations/es.json"
  
  const Profile = () => {
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [website, setWebsite] = useState("");
    // const [bio, setBio] = useState("");
    const [avatar_url, setAvatar_url] = useState("");
  
    const [isLoading, setIsLoading] = useState(false);
    const [isImageUploadLoading, setIsImageUploadLoading] = useState(false);
  
    const user = supabaseClient.auth.user();

    const {locale} = useRouter();
    const t = locale === "en" ? en : es;
  
    useEffect(() => {
      if (user) {
        setEmail(user.email);
        supabaseClient
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .then(({ data, error }) => {
            if (!error) {
              setUsername(data[0].username || "");
              setWebsite(data[0].website || "");
              // setBio(data[0].bio || "");
              setAvatar_url(data[0].avatar_url || "");
            }
          });
      }
      console.log(user.id);
    }, [user]);
  
    const updateHandler = async (event) => {
      event.preventDefault();
      setIsLoading(true);
      const body = { username, website};
      const userId = user.id;
      const { error } = await supabaseClient
        .from("profiles")
        .update(body)
        .eq("id", userId);
      if (!error) {
        setUsername(body.username);
        setWebsite(body.website);
        // setBio(body.bio);
      }
      setIsLoading(false);
    };
  
    function makeid(length) {
      let result = "";
      const characters =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      const charactersLength = characters.length;
      for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
      }
      return result;
    }
  
    const uploadHandler = async (event) => {
      setIsImageUploadLoading(true);
      const avatarFile = event.target.files[0];
      const fileName = makeid(10);
  
      const { error } = await supabaseClient.storage
        .from("avatars")
        .upload(fileName, avatarFile, {
          cacheControl: "3600",
          upsert: false,
        });
      if (error) {
        setIsImageUploadLoading(false);
        console.log("error", error);
        return;
      }
      const { publicURL, error: publicURLError } = supabaseClient.storage
        .from("avatars")
        .getPublicUrl(fileName);
      if (publicURLError) {
        setIsImageUploadLoading(false);
        console.log("publicURLError", publicURLError);
        return;
      }
      const userId = user.id;
      await supabaseClient
        .from("profiles")
        .update({
          avatar_url: publicURL,
        })
        .eq("id", userId);
      setAvatar_url(publicURL);
      setIsImageUploadLoading(false);
    };
  
    return (
      <Box>
        <Navbar />
        <Box mt="8" maxW="xl" mx="auto">
          <Flex align="center" justify="center" direction="column">
            <Avatar
              size="2xl"
              src={avatar_url || ""}
              name={username || user?.email}
            />
            <FormLabel
              htmlFor="file-input"
              my="5"
              borderRadius="2xl"
              borderWidth="1px"
              textAlign="center"
              p="2"
              bg="blue.400"
              color="white"
            >
              {isImageUploadLoading ? t.Profile.Adding : t.Profile.AddI}
            </FormLabel>
            <Input
              type="file"
              hidden
              id="file-input"
              onChange={uploadHandler}
              multiple={false}
              disabled={isImageUploadLoading}
            />
          </Flex>
          <Stack
            borderWidth="1px"
            borderRadius="lg"
            overflow="hidden"
            p={5}
            mt="-2"
            spacing="4"
            as="form"
            onSubmit={updateHandler}
          >
            <FormControl id="email" isRequired>
              <FormLabel>{t.Profile.Email}</FormLabel>
              <Input type="email" isDisabled={true} value={email} />
            </FormControl>
            <FormControl id="username" isRequired>
              <FormLabel>{t.Profile.User}</FormLabel>
              <Input
                placeholder="Add your username here"
                type="text"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
              />
            </FormControl>
            <FormControl id="website">
              <FormLabel>{t.Profile.Web}</FormLabel>
              <Input
                placeholder={t.Profile.WebD}
                type="url"
                value={website}
                onChange={(event) => setWebsite(event.target.value)}
              />
            </FormControl>
            {/* <FormControl id="bio">
              <FormLabel>{t.Profile.Bio}</FormLabel>
              <Textarea
                placeholder={t.Profile.BioD}
                value={bio}
                onChange={(event) => setBio(event.target.value)}
              />
            </FormControl> */}
            <Button colorScheme="blue" type="submit" isLoading={isLoading}>
              {t.Profile.Upd}
            </Button>
          </Stack>
        </Box>
      </Box>
    );
  };
  
  export default Profile;