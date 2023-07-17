import { Flex, Input, InputGroup, InputRightElement, Button, Spinner } from "@chakra-ui/react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addMessage, getMessageResponse } from "../../store/chat/chat.reducer";
import { selectChatIsLoading } from "../../store/chat/chat.selector";

const ChatInput = () => {

    const [query, setQuery] = useState('')
    const isLoading = useSelector(selectChatIsLoading)
    const dispatch = useDispatch()

    const handleChange = (event) => setQuery(event.target.value)

    const handleSubmit = async (e) => {
        e.preventDefault()
        dispatch(addMessage({role: "user", text: query}))
        const response = dispatch(getMessageResponse(query))
        if (response.chat) dispatch(addMessage(response))
        setQuery('')
    }
    return (
        <Flex justify="center" mt="5" pos="fixed" bottom="10" left="0" right="0">
            <InputGroup size='md' w="50%">
                <Input
                    pr='4.5rem'
                    type='text'
                    placeholder='Ask me anything about Olympics'
                    onChange={handleChange}
                    value={query}
                />
                <InputRightElement width='4.5rem'>
                    {isLoading ? <Spinner /> : 
                        <Button h='1.75rem' size='sm' type="submit" onClick={handleSubmit}>
                            Send
                        </Button>
                    }
                </InputRightElement>
            </InputGroup>
        </Flex>
    )
}

export default ChatInput;