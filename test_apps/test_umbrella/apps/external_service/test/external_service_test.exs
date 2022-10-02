defmodule ExternalServiceTest do
  use ExUnit.Case
  doctest ExternalService

  test "greets the world" do
    assert ExternalService.hello() == :world
  end
end
