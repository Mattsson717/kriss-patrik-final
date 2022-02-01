import React from "react";
import { MoonIcon, SunIcon } from "@chakra-ui/icons";
import { Box, IconButton, Stack, Text, useColorMode } from "@chakra-ui/react";

const ToggleTheme = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const isDark = colorMode === "dark";

  return (
    <Box
      d="flex"
      flexDirection="column"
      justifyContent="end"
      alignItems="center"
      p="1"
      pos="absolute"
      top="0"
      right="0"
    >
      <Stack isInline>
        <IconButton
          icon={isDark ? <SunIcon /> : <MoonIcon />}
          isRound="true"
          colorScheme="teal"
          aria-label="Color mode switcher"
          onClick={toggleColorMode}
        >
          Switch Mode
        </IconButton>
      </Stack>
      <Text fontSize="11px" mx="2">
        {colorMode === "light" ? "Light" : "Dark"}
      </Text>
    </Box>
  );
};

export default ToggleTheme;
