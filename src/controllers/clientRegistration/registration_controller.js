import { Registration } from "../../model/clientRegistration/registraion_model.js";
import { ApiResponse } from "../../utils/ApiResponse/ApiResponse.js";

export const cholaClientRegistration = async (req, res) => {
  try {
    const {
      name,
      email,
      alternateEmail,
      phone,
      alternatePhone,
      companyName,
      domainName,
    } = req.body;

    if (!email || !domainName) {
      return res
        .status(400)
        .json(new ApiResponse(400, {}, "Email and domainName are required"));
    }

    const exists = await Registration.findOne({ email });

    if (exists) {
      return res
        .status(409)
        .json(new ApiResponse(409, {}, "User already exists"));
    }

    const user = new Registration({
      name,
      email,
      alternateEmail,
      phone,
      alternatePhone,
      companyName,
      domainName,
    });

    const savedUser = await user.save();

    if (!savedUser) {
      return res
        .status(500)
        .json(new ApiResponse(500, {}, "Registration failed"));
    }

    return res
      .status(201)
      .json(new ApiResponse(201, savedUser, "Client registered successfully"));
  } catch (error) {
    return res.status(500).json(new ApiResponse(500, {}, error.message));
  }
};

export const cholaClients = async (req, res) => {
  const data = await Registration.find({});

  if (!data && data.length < 0) {
    return res
      .status(400)
      .json(new ApiResponse(400, {}, "Client not register yet"));
  }

  return res
    .status(200)
    .json(new ApiResponse(400, data, "CLient data fetch successfully"));
};