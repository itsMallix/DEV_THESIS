def decode_hex_data(hex_string):
    # Remove '0x' prefix if present
    if hex_string.startswith('0x'):
        hex_string = hex_string[2:]
    
    # Convert hex to bytes
    data = bytes.fromhex(hex_string)
    
    # Parse the data according to ABI encoding rules
    # First 4 bytes are function selector (skip for this case)
    # Next 32 bytes chunks contain the actual data
    
    def read_uint256(data, offset):
        return int.from_bytes(data[offset:offset+32], 'big')
    
    def read_address(data, offset):
        # Address is in the last 20 bytes of a 32-byte slot
        addr_bytes = data[offset+12:offset+32]
        return '0x' + addr_bytes.hex()
    
    def read_string(data, string_offset):
        # String length is stored in the first 32 bytes at the offset
        length = read_uint256(data, string_offset)
        # String data starts 32 bytes after the length
        string_data = data[string_offset+32:string_offset+32+length]
        return string_data.decode('utf-8')
    
    # Skip function selector (first 4 bytes)
    offset = 4
    
    # Read owner address (32 bytes)
    owner = read_address(data, offset)
    offset += 32
    
    # Skip string offset pointers (we'll read them later)
    # These are: name, instagram, twitter, telegram, title, description, image offsets
    name_offset_ptr = read_uint256(data, offset)
    offset += 32
    instagram_offset_ptr = read_uint256(data, offset)
    offset += 32
    twitter_offset_ptr = read_uint256(data, offset)
    offset += 32
    telegram_offset_ptr = read_uint256(data, offset)
    offset += 32
    title_offset_ptr = read_uint256(data, offset)
    offset += 32
    description_offset_ptr = read_uint256(data, offset)
    offset += 32
    
    # Read target (uint256)
    target = read_uint256(data, offset)
    offset += 32
    
    # Read deadline (uint256)
    deadline = read_uint256(data, offset)
    offset += 32
    
    # Read image offset pointer
    image_offset_ptr = read_uint256(data, offset)
    
    # Now read the actual strings using their offset pointers
    # Add 4 to account for function selector we skipped
    name = read_string(data, name_offset_ptr + 4)
    instagram = read_string(data, instagram_offset_ptr + 4)
    twitter = read_string(data, twitter_offset_ptr + 4)
    telegram = read_string(data, telegram_offset_ptr + 4)
    title = read_string(data, title_offset_ptr + 4)
    description = read_string(data, description_offset_ptr + 4)
    image = read_string(data, image_offset_ptr + 4)
    
    return {
        'owner': owner,
        'target': target,
        'deadline': deadline,
        'name': name,
        'instagram': instagram,
        'twitter': twitter,
        'telegram': telegram,
        'title': title,
        'description': description,
        'image': image
    }

# Your hex data
hex_data = "0xda52d95f0000000000000000000000006c4546f7f643ee27cc102c8027a8cd8cc77e4edf0000000000000000000000000000000000000000000000000000000000000140000000000000000000000000000000000000000000000000000000000000018000000000000000000000000000000000000000000000000000000000000001c00000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000024000000000000000000000000000000000000000000000000000000000000002a000000000000000000000000000000000000000000000000006f05b59d3b200000000000000000000000000000000000000000000000000000000019ad20f28000000000000000000000000000000000000000000000000000000000000000320000000000000000000000000000000000000000000000000000000000000000642756c696e670000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000662756c696e670000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000662756c696e670000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000662756c696e670000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002362616e67756e616e206d7573686f6c6c616820646920706f6e70657320616d6272756b0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000005c62616e67756e616e20706f6e70657320616d6272756b206b6172656e61206b6573616c6168616e20737472756b7475722064616e20626168616e2062616e67756e616e2c2062616e79616b2073616e747269206d656e696e6767616c00000000000000000000000000000000000000000000000000000000000000000000008168747470733a2f2f6d656469612e73756172612e636f6d2f70696374757265732f363533783336362f323032352f30392f32392f32343335302d62616e67756e616e2d6d7573616c612d706f6e646f6b2d616c2d6b686f7a696e792d7369646f61726a6f2d616d6272756b2d706f6e7065732d616c2d6b686f7a696e792e6a706700000000000000000000000000000000000000000000000000000000000000"

# Decode the data
result = decode_hex_data(hex_data)
print(f"deadline: {result['deadline']}")
print(f"description: {result['description']}")
print(f"image: {result['image']}")
print(f"instagram: {result['instagram']}")
print(f"name: {result['name']}")
print(f"target: {result['target']}")
print(f"telegram: {result['telegram']}")
print(f"title: {result['title']}")
print(f"twitter: {result['twitter']}")
print(f"owner: {result['owner']}")