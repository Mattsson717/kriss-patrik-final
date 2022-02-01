import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Box,
  Heading,
  Text,
  Flex,
  useColorModeValue,
  Img,
} from "@chakra-ui/react";

const Start = () => {
  const navigate = useNavigate();

  return (
    <Flex height="vh100" alignItems="center" justifyContent="center">
      <Box
        textAlign="center"
        py={10}
        px={6}
        rounded={"lg"}
        bg={useColorModeValue("white", "gray.700")}
        boxShadow={"lg"}
        width={600}
      >
        <Heading
          display="inline-block"
          as="h2"
          size="2xl"
          bgGradient="linear(to-r, teal.400, teal.600)"
          backgroundClip="text"
        >
          <Img
            width={300}
            src="https://i.ibb.co/852S8CK/Love-heart-logo-and-template-vector.jpg"
          />
          GIVERS GAME
        </Heading>
        <Text fontSize="14px" mt={3} mb={2}>
          So as I terrorize Gotham, I will feed its people hope to poison their
          souls. I will let them believe that they can survive so that you can
          watch them climbing over each other to stay in the sun. You can watch
          me torture an entire city. And then when you’ve truly understood the
          depth of your failure, we will fulfill Ra’s Al Ghul’s destiny. We will
          destroy Gotham. And then, when that is done, and Gotham is… ashes Then
          you have my permission to die.
        </Text>
        <Button
          colorScheme="teal"
          bgGradient="linear(to-r, teal.400, teal.500, teal.600)"
          color="white"
          variant="solid"
          onClick={() => navigate("/Login")}
        >
          Enter
        </Button>
      </Box>
    </Flex>
  );
};

export default Start;
