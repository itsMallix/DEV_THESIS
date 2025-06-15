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
hex_data = "0xda52d95f0000000000000000000000004493955ff6ad5d5e921f0da2bd1b583441b6900b0000000000000000000000000000000000000000000000000000000000000140000000000000000000000000000000000000000000000000000000000000018000000000000000000000000000000000000000000000000000000000000001c000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000240000000000000000000000000000000000000000000000000000000000000028000000000000000000000000000000000000000000000000000b1a2bc2ec5000000000000000000000000000000000000000000000000000000000197b3d5740000000000000000000000000000000000000000000000000000000000000002e000000000000000000000000000000000000000000000000000000000000000094d617320527573646900000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000017696e7374616772616d2e636f6d2f6d61735f7275736469000000000000000000000000000000000000000000000000000000000000000000000000000000000f782e636f6d2f6d61735f72757364690000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001674656c656772616d2e636f6d2f6d61735f727573646900000000000000000000000000000000000000000000000000000000000000000000000000000000001647656d7061206c656d70656e672074656b746f6e696b0000000000000000000000000000000000000000000000000000000000000000000000000000000000325465726a6164692067656d7061206c656d70656e672074656b6e6f6e696b206469206e67617769206a6177612074696d75720000000000000000000000000000000000000000000000000000000000000000000000000000000000000000004b68747470733a2f2f696d672e6a616b706f73742e6e65742f632f323031382f30372f33302f323031385f30375f33305f35303131325f313533323934333633392e5f6c617267652e6a7067000000000000000000000000000000000000000000"

# Decode the data
result = decode_hex_data(hex_data)

# Print in the requested format
print(f"owner: {result['owner']}")
print(f"target: {result['target']}")
print(f"deadline: {result['deadline']}")
print(f"name: {result['name']}")
print(f"instagram: {result['instagram']}")
print(f"twitter: {result['twitter']}")
print(f"telegram: {result['telegram']}")
print(f"title: {result['title']}")
print(f"description: {result['description']}")
print(f"image: {result['image']}")