<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Carbon\Carbon;

class FileUploadController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        // Show all stored S3 files
      $baseUrl = str_replace('csvreader', '', Storage::disk('s3')->url('csvreader'));
      $allFiles = Storage::disk('s3')->allFiles('csvreader');
      return response()->json(['status' => 201, 'message' => 'success', 'baseUrl' => $baseUrl, 'files' => $allFiles]);
    }

    /**
     * @param Request $request
     */
    public function delete(Request $request) {
      if($request->filePath) {
        Storage::disk('s3')->delete($request->filePath);
        return response()->json(['success' => 200, 'sent' => $request->filePath]);
      } else
        return response()->json(['error' => 404]);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        /*
         * ✅ Check the file extension type
         * ✅ Create a unique name for file
         * ✅ Send back filename and URL
         * ✅ Send correct status codes
         */
        $fileExtension = $request->file_upload->getClientOriginalExtension();
        $imageName = Carbon::now()->timestamp . $request->file_upload->getClientOriginalName();

        if ($fileExtension !== 'csv')
            return response()->json(['status' => 400, 'message' => 'error. Invalid file type.', 'extension' => $fileExtension, 'data' => $request->all()]);

        if (Storage::disk('s3')->putFileAs('csvreader', $request->file_upload, $imageName)) {
            $fileUrl = Storage::disk('s3')->url('csvreader') . '/' . $imageName;
            return response()->json(['status' => 201, 'message' => 'Success. File was stored.', 'data' => [
                'filename' => $imageName,
                'url' => $fileUrl
            ] ]);
        } else
            return response()->json(['status' => 500, 'message' => 'error. Failed to store file.', 'data' => $request->all()]);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
      return response()->json($id);
    }
}
