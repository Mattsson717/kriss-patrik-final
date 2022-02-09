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
        <Img
          width={200}
          src="https://i.ibb.co/qdwgc0h/Pngtree-hand-drawn-heart-shaped-heart-outline-6044489.png"
        />
        <Heading
          display="inline-block"
          as="h2"
          size="2xl"
          bgGradient="linear(to-r, teal.400, teal.600)"
          backgroundClip="text"
        >
          GIVERS GAME
        </Heading>

        <Text fontSize="14px" mt={3} mb={2}>
          "In Sweden, when someone suffers from loss and grief, we often feel
          that "we should not disturb", or we offer our help in a text message
          and then feel that "now we have done our part"… In Italy, it is a
          matter of principle that the whole family moves in and takes over
          everything that is part of everyday life. Shopping and cooking,
          babysitting, cleaning, contributing with money, etc. Everything that
          just have to work, but which for various reasons suddenly does not
          when you suffer a loss. " - Helena Sörmander
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
