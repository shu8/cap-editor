import { afterEach, describe, expect, jest, test } from "@jest/globals";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";

import userEvent from "@testing-library/user-event";
import { MapForm } from "../../../components/editor/fields";
import { TestingProvider, defaultFormData } from "../helpers";

const props = {
  alertData: { ...defaultFormData },
  alertingAuthority: { countryCode: "GB" },
};

const geojsonResponse = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      id: "England",
      properties: { ADMIN: "England", ISO_A3: "GBR" },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-6.36867904666016, 49.8858833313549],
            [1.75900208943311, 49.8858833313549],
            [1.75900208943311, 55.8041437929974],
            [-6.36867904666016, 55.8041437929974],
            [-6.36867904666016, 49.8858833313549],
          ],
        ],
      },
    },
  ],
};

const englandPolygon = [
  [49.886, -6.369],
  [49.886, 1.759],
  [55.804, 1.759],
  [55.804, -6.369],
  [49.886, -6.369],
];

afterEach(() => {
  global.fetch.mockClear();
  delete global.fetch;
});

describe("<MapForm>", () => {
  test("fetches regions and renders correctly", async () => {
    global.fetch = jest
      .fn()
      .mockImplementationOnce(() =>
        Promise.resolve({ json: () => Promise.resolve(geojsonResponse) })
      ) as any;

    const onUpdate = jest.fn();
    render(<MapForm {...props} onUpdate={onUpdate} />, {
      wrapper: TestingProvider,
    });

    await screen.findByText("Area Description");
    await screen.findByText("OSM");
    await screen.findByText("Choose/type area name...");
    await screen.findByText(
      "Type the description of a custom area, or quick-add:"
    );
    await screen.findByText("England");
    expect(
      screen.queryByText("There was an error fetching map regions", {
        exact: false,
      })
    ).toBeNull();
  });

  test("renders correctly and handles fetch error", async () => {
    global.fetch = jest
      .fn()
      .mockImplementationOnce(() =>
        Promise.resolve({ json: () => Promise.resolve({ error: true }) })
      ) as any;
    const onUpdate = jest.fn();

    render(<MapForm {...props} onUpdate={onUpdate} />, {
      wrapper: TestingProvider,
    });

    await screen.findByText("Area Description");
    await screen.findByText("OSM");
    await screen.findByText("Choose/type area name...");
    await screen.findByText(
      "Type the description of a custom area, or quick-add:"
    );
    await screen.findByText("There was an error fetching map regions", {
      exact: false,
    });
  });

  test("handles quick-add correctly", async () => {
    global.fetch = jest
      .fn()
      .mockImplementationOnce(() =>
        Promise.resolve({ json: () => Promise.resolve(geojsonResponse) })
      ) as any;

    const onUpdate = jest.fn();
    render(<MapForm {...props} onUpdate={onUpdate} />, {
      wrapper: TestingProvider,
    });

    const user = userEvent.setup();
    const option = await screen.findByText("England");
    await user.click(option);

    await screen.findByText("Polygon");
    await screen.findByText("Circle");
    await screen.findByText(
      "Use the drawing tool or paste in polygon coordinates",
      { exact: false }
    );
    await screen.findByText(
      "Use the drawing tool or paste in circle coordinates",
      { exact: false }
    );
    await screen.findByText("Geocode");
    await screen.findByText("Add Geocode?");
    await screen.findByText("No geocodes added yet");

    expect(onUpdate).toBeCalledTimes(1);
    expect(onUpdate).toBeCalledWith({
      regions: {
        England: {
          polygons: [englandPolygon],
          circles: [],
          geocodes: {},
        },
      },
    });
  });

  test("renders polygon coordinates correctly", async () => {
    global.fetch = jest
      .fn()
      .mockImplementationOnce(() =>
        Promise.resolve({ json: () => Promise.resolve(geojsonResponse) })
      ) as any;

    const onUpdate = jest.fn();

    const propsWithRegions = JSON.parse(JSON.stringify(props));
    propsWithRegions.alertData.regions = {
      England: {
        polygons: [englandPolygon],
        circles: [],
        geocodes: {},
      },
    };
    render(<MapForm {...propsWithRegions} onUpdate={onUpdate} />, {
      wrapper: TestingProvider,
    });

    const user = userEvent.setup();
    const option = await screen.findByText("Choose/type area name...");
    await user.click(option);

    // Click the 'England' in the Dropdown
    const englandOptions = await screen.findAllByText("England");
    await user.click(englandOptions[1]);
    const inputs = await screen.findAllByRole("textbox");
    expect((inputs[1] as HTMLTextAreaElement).value.trim()).toEqual(
      "49.886,-6.369 49.886,1.759 55.804,1.759 55.804,-6.369 49.886,-6.369"
    );
  });

  test("renders circle coordinates correctly", async () => {
    global.fetch = jest
      .fn()
      .mockImplementationOnce(() =>
        Promise.resolve({ json: () => Promise.resolve(geojsonResponse) })
      ) as any;

    const onUpdate = jest.fn();

    const propsWithRegions = JSON.parse(JSON.stringify(props));
    propsWithRegions.alertData.regions = {
      England: {
        polygons: [],
        circles: ["52.603,-1.875 65.519"],
        geocodes: {},
      },
    };
    render(<MapForm {...propsWithRegions} onUpdate={onUpdate} />, {
      wrapper: TestingProvider,
    });

    const user = userEvent.setup();
    const option = await screen.findByText("Choose/type area name...");
    await user.click(option);

    // Click the 'England' in the Dropdown
    const englandOptions = await screen.findAllByText("England");
    await user.click(englandOptions[1]);
    const inputs = await screen.findAllByRole("textbox");
    expect((inputs[2] as HTMLTextAreaElement).value.trim()).toEqual(
      "52.603,-1.875 65.519"
    );
  });

  test("renders geocodes correctly", async () => {
    global.fetch = jest
      .fn()
      .mockImplementationOnce(() =>
        Promise.resolve({ json: () => Promise.resolve(geojsonResponse) })
      ) as any;

    const onUpdate = jest.fn();

    const propsWithRegions = JSON.parse(JSON.stringify(props));
    propsWithRegions.alertData.regions = {
      England: {
        polygons: [],
        circles: [],
        geocodes: { ZIP: "TEST" },
      },
    };
    render(<MapForm {...propsWithRegions} onUpdate={onUpdate} />, {
      wrapper: TestingProvider,
    });

    const user = userEvent.setup();
    const option = await screen.findByText("Choose/type area name...");
    await user.click(option);

    // Click the 'England' in the Dropdown
    const englandOptions = await screen.findAllByText("England");
    await user.click(englandOptions[1]);

    await screen.findByText("ZIP: TEST", { exact: false });
  });

  test("handles creating and cancelling geocode correctly", async () => {
    global.fetch = jest
      .fn()
      .mockImplementationOnce(() =>
        Promise.resolve({ json: () => Promise.resolve(geojsonResponse) })
      ) as any;

    const onUpdate = jest.fn();

    const propsWithRegions = JSON.parse(JSON.stringify(props));
    propsWithRegions.alertData.regions = {
      England: {
        polygons: [],
        circles: [],
        geocodes: {},
      },
    };
    render(<MapForm {...propsWithRegions} onUpdate={onUpdate} />, {
      wrapper: TestingProvider,
    });

    const user = userEvent.setup();
    const option = await screen.findByText("Choose/type area name...");
    await user.click(option);

    // Click the 'England' in the Dropdown
    const englandOptions = await screen.findAllByText("England");
    await user.click(englandOptions[1]);

    const addGeocodeBtn = await screen.findByText("Add Geocode?");
    await user.click(addGeocodeBtn);

    await screen.findByText("Type");
    await screen.findAllByText("Geocode");
    await screen.findByText("Save");

    const cancelBtn = await screen.findByText("Cancel");
    await user.click(cancelBtn);

    await screen.findByText("Add Geocode?");
    await screen.findByText("No geocodes added yet");
  });

  test("handles creating geocode correctly", async () => {
    global.fetch = jest
      .fn()
      .mockImplementationOnce(() =>
        Promise.resolve({ json: () => Promise.resolve(geojsonResponse) })
      ) as any;

    const onUpdate = jest.fn();

    const propsWithRegions = JSON.parse(JSON.stringify(props));
    propsWithRegions.alertData.regions = {
      England: {
        polygons: [],
        circles: [],
        geocodes: {},
      },
    };
    render(<MapForm {...propsWithRegions} onUpdate={onUpdate} />, {
      wrapper: TestingProvider,
    });

    const user = userEvent.setup();
    const option = await screen.findByText("Choose/type area name...");
    await user.click(option);

    // Click the 'England' in the Dropdown
    const englandOptions = await screen.findAllByText("England");
    await user.click(englandOptions[1]);

    const addGeocodeBtn = await screen.findByText("Add Geocode?");
    await user.click(addGeocodeBtn);

    await screen.findByText("Type");
    await screen.findAllByText("Geocode");

    const inputs = await screen.findAllByRole("textbox");
    await user.type(inputs[3], "Description");
    await user.type(inputs[4], "Value");

    const saveBtn = await screen.findByText("Save");
    await user.click(saveBtn);

    expect(onUpdate).toBeCalledTimes(1);
    expect(onUpdate).toBeCalledWith({
      regions: {
        England: {
          polygons: [],
          circles: [],
          geocodes: { Description: "Value" },
        },
      },
    });
  });

  test("handles creating custom area name correctly", async () => {
    global.fetch = jest
      .fn()
      .mockImplementationOnce(() =>
        Promise.resolve({ json: () => Promise.resolve(geojsonResponse) })
      ) as any;

    const onUpdate = jest.fn();
    render(<MapForm {...props} onUpdate={onUpdate} />, {
      wrapper: TestingProvider,
    });

    const user = userEvent.setup();
    const option = await screen.findByText("Choose/type area name...");
    await user.click(option);
    await user.type(option, "Custom Area");
    const newOption = await screen.findByText(`Create option "`, {
      exact: false,
    });
    await user.click(newOption);

    expect(onUpdate).toBeCalledTimes(1);
    expect(onUpdate).toBeCalledWith({
      regions: { "Custom Area": { polygons: [], circles: [], geocodes: {} } },
    });
  });
});
