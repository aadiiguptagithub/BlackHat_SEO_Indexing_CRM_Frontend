import React, { useState } from "react";
import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";
import { Card } from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import {
  ImageIcon,
  Search,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
  IndianRupee,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import { useToast } from "../../../hooks/use-toast";
import { AddMediaModal } from "./AddMediaModal";
import { EditMediaModal } from "./EditMediaModal";
import { DeleteMediaDialog } from "./DeleteMediaDialog";

// Updated mock data with price and HSN code
const MOCK_MEDIA = [
  {
    id: 1,
    name: "Flex Banner",
    pricePerSqFt: 25.0,
    hsnCode: "39209100",
    status: "active",
  },
  {
    id: 2,
    name: "Vinyl Print",
    pricePerSqFt: 35.0,
    hsnCode: "39191019",
    status: "active",
  },
  {
    id: 3,
    name: "Standee",
    pricePerSqFt: 45.0,
    hsnCode: "48109990",
    status: "active",
  },
  {
    id: 4,
    name: "Canopy",
    pricePerSqFt: 28.0,
    hsnCode: "63069000",
    status: "inactive",
  },
  {
    id: 5,
    name: "Poster",
    pricePerSqFt: 15.0,
    hsnCode: "48191000",
    status: "active",
  },
];

const ITEMS_PER_PAGE_OPTIONS = [5, 10, 20, 50];

export function MediaSettings() {
  const { toast } = useToast();
  const [media, setMedia] = useState(MOCK_MEDIA);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState(null);

  // Filter media based on search term
  const filteredMedia = media.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.hsnCode.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate pagination
  const totalPages = Math.ceil(filteredMedia.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentMedia = filteredMedia.slice(startIndex, endIndex);

  // Handle media actions
  const handleAddMedia = (mediaData) => {
    const newMedia = {
      id: Math.max(...media.map((m) => m.id), 0) + 1,
      ...mediaData,
      status: "active",
    };
    setMedia([...media, newMedia]);
    setIsAddModalOpen(false);
    toast({
      title: "✅ Success",
      description: "Media type added successfully",
    });
  };

  const handleEditMedia = (mediaData) => {
    setMedia(
      media.map((item) => (item.id === mediaData.id ? mediaData : item))
    );
    setIsEditModalOpen(false);
    toast({
      title: "✅ Success",
      description: "Media type updated successfully",
    });
  };

  const handleDeleteMedia = (mediaId) => {
    setMedia(media.filter((item) => item.id !== mediaId));
    setIsDeleteDialogOpen(false);
    toast({
      title: "🗑️ Success",
      description: "Media type deleted successfully",
    });
  };

  // Toggle media status
  const toggleMediaStatus = (mediaId) => {
    setMedia(
      media.map((item) =>
        item.id === mediaId
          ? {
              ...item,
              status: item.status === "active" ? "inactive" : "active",
            }
          : item
      )
    );
    toast({
      title: "🔄 Success",
      description: "Media status updated successfully",
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <ImageIcon className="h-8 w-8 text-primary" />
          <h1 className="text-2xl font-bold text-gray-900">Media Management</h1>
        </div>
        <p className="text-gray-600">
          Manage media types, pricing, and HSN codes for orders
        </p>
      </div>

      {/* Search and Add Section */}
      <Card className="p-4 mb-6 shadow-sm">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex gap-2 w-full md:w-auto">
            <Input
              placeholder="Search media types or HSN codes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="min-w-[250px]"
            />
            <Button variant="secondary" size="sm">
              <Search className="h-4 w-4" />
            </Button>
          </div>
          <Button
            onClick={() => setIsAddModalOpen(true)}
            className="w-full md:w-auto"
          >
            + Add Media Type
          </Button>
        </div>
      </Card>

      {/* Media List */}
      <Card className="mb-6 overflow-hidden shadow-sm">
        <div className="divide-y">
          {currentMedia.length > 0 ? (
            currentMedia.map((item) => (
              <div
                key={item.id}
                className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start gap-4">
                  <div className="bg-blue-50 p-2 rounded-lg">
                    <ImageIcon className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{item.name}</h3>
                    <div className="flex items-center gap-4 mt-1">
                      <div className="flex items-center gap-1 text-sm text-emerald-600">
                        <IndianRupee className="h-3 w-3" />
                        <span className="font-medium">
                          {item.pricePerSqFt.toFixed(2)}
                        </span>
                        <span className="text-gray-500">per sq. ft</span>
                      </div>
                      <div className="text-sm text-gray-500">
                        HSN: <span className="font-mono">{item.hsnCode}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => toggleMediaStatus(item.id)}
                    className="cursor-pointer"
                  >
                    <Badge
                      className={
                        item.status === "active"
                          ? "bg-green-100 text-green-800 hover:bg-green-200"
                          : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                      }
                    >
                      {item.status === "active" ? "Active" : "Inactive"}
                    </Badge>
                  </button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSelectedMedia(item);
                      setIsEditModalOpen(true);
                    }}
                    className="hover:bg-amber-50"
                  >
                    <Pencil className="h-4 w-4 text-amber-600" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSelectedMedia(item);
                      setIsDeleteDialogOpen(true);
                    }}
                    className="hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4 text-red-600" />
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <div className="p-12 text-center text-gray-500">
              <ImageIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No media types found
              </h3>
              <p className="text-gray-500 mb-4">
                Try adjusting your search or add a new media type.
              </p>
            </div>
          )}
        </div>
      </Card>

      {/* Pagination */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="text-sm text-gray-500">
          Showing {Math.min(startIndex + 1, filteredMedia.length)} to{" "}
          {Math.min(endIndex, filteredMedia.length)} of {filteredMedia.length}{" "}
          results
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            const page = Math.max(1, Math.min(totalPages, currentPage - 2 + i));
            return (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </Button>
            );
          })}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Select
            value={itemsPerPage.toString()}
            onValueChange={(v) => {
              setItemsPerPage(Number(v));
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="w-[100px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {ITEMS_PER_PAGE_OPTIONS.map((value) => (
                <SelectItem key={value} value={value.toString()}>
                  {value} / page
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Modals */}
      <AddMediaModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddMedia}
      />
      {selectedMedia && (
        <EditMediaModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedMedia(null);
          }}
          onSubmit={handleEditMedia}
          media={selectedMedia}
        />
      )}
      {selectedMedia && (
        <DeleteMediaDialog
          isOpen={isDeleteDialogOpen}
          onClose={() => {
            setIsDeleteDialogOpen(false);
            setSelectedMedia(null);
          }}
          onConfirm={() => handleDeleteMedia(selectedMedia.id)}
          mediaName={selectedMedia.name}
        />
      )}
    </div>
  );
}
